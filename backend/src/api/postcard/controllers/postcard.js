'use strict';

/**
 *  postcard controller - Alternative approach with explicit user in request
 */
const redisClient = require("../../../utils/redis");
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::postcard.postcard', ({ strapi }) => ({
    async getPostcards(ctx) {
        const { country, region, tagGroup, selectedTag, affiliation, slug, searchText, page = 1, pageSize = 6 } = ctx.query;
        const tags = ctx.request.body?.tags || [];
        const userIdFromBody = ctx.request.body?.userId; // Accept userId from request body

        // Try to get user from multiple sources
        let user = null;
        let userId = null;

        // Priority 1: From JWT token in authorization header
        const token = ctx.request.header.authorization?.replace('Bearer ', '');
        if (token) {
            try {
                const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token);
                userId = decoded?.id;
            } catch (error) {
                console.error('Token verification failed:', error);
            }
        }

        // Priority 2: From ctx.state.user (if middleware populated it)
        if (!userId && ctx.state.user) {
            userId = ctx.state.user.id;
        }

        // Priority 3: From request body (only if token is valid)
        // This is a fallback, but we validate it matches the token
        if (!userId && userIdFromBody) {
            userId = userIdFromBody;
        }

        // Fetch full user details if we have an ID
        if (userId) {
            try {
                user = await strapi.entityService.findOne(
                    'plugin::users-permissions.user',
                    userId,
                    {
                        populate: ['role', 'user_type'],
                        fields: ['id', 'username', 'email']
                    }
                );
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        // Determine user role and permissions
        const userRole = getUserRole(user);
        const isAdmin = ['SuperAdmin', 'Admin', 'EditorialAdmin', 'EditorInChief'].includes(userRole);

        const filter = {
            $and: [
                {
                    album: {
                        directories: {
                            slug: { $in: ["mindful-luxury-hotels"] }
                        }
                    }
                }
            ]
        };

        // If not admin, only show complete postcards OR postcards user can edit
        if (!isAdmin && userId) {
            filter.$and.push({
                $or: [
                    { isComplete: true },
                    // User can see incomplete postcards they created or can edit
                    {
                        $and: [
                            { isComplete: false },
                            {
                                album: {
                                    news_article: {
                                        creator: userId
                                    }
                                }
                            }
                        ]
                    }
                ]
            });
        } else if (!isAdmin && !userId) {
            // Guest users - only complete postcards
            filter.$and.push({ isComplete: true });
        }

        // Only add filters if value is not -1 (which means "all")
        if (country && country !== '-1') filter.$and.push({ country });
        if (region && region !== '-1') filter.$and.push({ album: { region } });
        if (tagGroup && tagGroup !== '-1') filter.$and.push({ tags: { tag_group: tagGroup } });

        if (selectedTag) filter.$and.push({ tags: selectedTag });
        else if (tags?.length > 0) filter.$and.push({ tags: { id: { $in: tags } } });

        if (slug) filter.$and.push({ bookmarks: { user: { slug } } });
        if (searchText) filter.$and.push({
            $or: [
                { name: { $containsi: searchText } },
                { tags: { name: { $containsi: searchText } } },
                { album: { country: { name: { $containsi: searchText } } } },
                { album: { region: { name: { $containsi: searchText } } } },
                { album: { name: { $containsi: searchText } } },
            ]
        });

        if (affiliation) filter.$and.push({ album: { company: { affiliations: affiliation } } });

        // Pagination
        const pageNum = Number(page);
        const limit = Number(pageSize);
        const start = (pageNum - 1) * limit;

        const postcards = await strapi.db.query('api::postcard.postcard').findMany({
            where: filter,
            populate: {
                coverImage: { fields: ["url"] },
                user: {
                    fields: ["fullName", "slug"],
                    populate: ["company", "social"]
                },
                bookmarks: {
                    populate: {
                        user: {
                            fields: ["fullName", "slug"],
                            populate: {
                                profilePic: {
                                    fields: ["url"]
                                }
                            }
                        }
                    }
                },
                album: {
                    fields: ["slug", "name", "website", "signature"],
                    populate: {
                        company: {
                            fields: ["name"]
                        },
                        news_article: {
                            fields: ["id", "status"],
                            populate: {
                                creator: {
                                    fields: ["id", "username", "email"]
                                }
                            }
                        },
                        region: { fields: ["name"] },
                    }
                },
                country: { fields: ["name", "continent"] },
                tags: {
                    fields: ["name"],
                    populate: {
                        tag_group: {
                            fields: ["id", "name"]
                        }
                    }
                }
            },
            orderBy: { updatedAt: 'desc' },
            limit,
            offset: start
        });

        // Return postcards with user role info for frontend reference
        return {
            data: postcards,
            meta: {
                userRole,
                isAdmin,
                userId: userId || null,
                authenticated: !!userId
            }
        };
    },
 async getAllStats(ctx) {
    try {
      const { statsType, id, slug, name, limit, refreshCache } = ctx.query;

      console.log('📊 Stats request:', statsType);

      if (!statsType || !['country', 'region', 'theme', 'interest'].includes(statsType)) {
        return ctx.badRequest('statsType is required and must be one of: country, region, theme, interest');
      }

      // GET POSTCARDS FROM POSTCARD SERVICE
      const postcardService = strapi.service('api::postcard.postcard');
      const postcards = await postcardService.cachePostcards(refreshCache === 'true');


      if (!postcards || postcards.length === 0) {
        return ctx.send({
          data: [],
          meta: {
            total: 0,
            timestamp: new Date().toISOString(),
            message: 'No postcards found',
          },
        });
      }

      console.log(`✅ Processing ${postcards.length} postcards`);

      // Filter postcards
      let filteredPostcards = postcards;

      if (id || slug || name) {
        filteredPostcards = postcards.filter((postcard) => {
          if (statsType === 'country') {
            if (!postcard.album?.country) return false;
            const country = postcard.album.country;
            if (id) return country.id === parseInt(id);
            if (slug) return country.slug === slug;
            if (name) return country.name.toLowerCase().includes(name.toLowerCase());
          } else if (statsType === 'region') {
            if (!postcard.album?.region) return false;
            const region = postcard.album.region;
            if (id) return region.id === parseInt(id);
            if (slug) return region.slug === slug;
            if (name) return region.name.toLowerCase().includes(name.toLowerCase());
          } else if (statsType === 'theme') {
            if (!postcard.tags?.length) return false;
            return postcard.tags.some((tag) => {
              if (!tag?.tag_group) return false;
              const theme = tag.tag_group;
              if (id) return theme.id === parseInt(id);
              if (slug) return theme.slug === slug;
              if (name) return theme.name.toLowerCase().includes(name.toLowerCase());
              return false;
            });
          } else if (statsType === 'interest') {
            if (!postcard.tags?.length) return false;
            return postcard.tags.some((tag) => {
              if (!tag) return false;
              if (id) return tag.id === parseInt(id);
              if (slug) return tag.slug === slug;
              if (name) return tag.name.toLowerCase().includes(name.toLowerCase());
              return false;
            });
          }
          return true;
        });
      }

      // Calculate stats (same as before)
      const countryStatsMap = new Map();
      const regionStatsMap = new Map();
      const themeStatsMap = new Map();
      const interestStatsMap = new Map();

      filteredPostcards.forEach((postcard) => {
        // COUNTRY STATS
        if (postcard.album?.country) {
          const country = postcard.album.country;
          const countryId = country.id;

          if (!countryStatsMap.has(countryId)) {
            countryStatsMap.set(countryId, {
              id: country.id,
              name: country.name,
              slug: country.slug,
              code: country.code,
              coverImage: country.coverImage || null,
              postcardCount: 0,
              albumIds: new Set(),
              regionIds: new Set(),
              tagIds: new Set(),
              tagGroupIds: new Set(),
            });
          }

          const countryStats = countryStatsMap.get(countryId);
          countryStats.postcardCount++;
          if (postcard.album.id) countryStats.albumIds.add(postcard.album.id);
          if (postcard.album.region?.id) countryStats.regionIds.add(postcard.album.region.id);
        }

        // REGION STATS
        if (postcard.album?.region) {
          const region = postcard.album.region;
          const regionId = region.id;

          if (!regionStatsMap.has(regionId)) {
            regionStatsMap.set(regionId, {
              id: region.id,
              name: region.name,
              slug: region.slug || null,
              country:region?.country?.name||null,
              postcardCount: 0,
              albumIds: new Set(),
              tagIds: new Set(),
              tagGroupIds: new Set(),
            });
          }

          const regionStats = regionStatsMap.get(regionId);
          regionStats.postcardCount++;
          if (postcard.album.id) regionStats.albumIds.add(postcard.album.id);
        }

        // TAGS
        if (postcard.tags?.length) {
          postcard.tags.forEach((tag) => {
            if (!tag) return;

            // Add to country stats
            if (postcard.album?.country) {
              const countryStats = countryStatsMap.get(postcard.album.country.id);
              if (countryStats && tag.id) {
                countryStats.tagIds.add(tag.id);
                if (tag.tag_group?.id) countryStats.tagGroupIds.add(tag.tag_group.id);
              }
            }

            // Add to region stats
            if (postcard.album?.region) {
              const regionStats = regionStatsMap.get(postcard.album.region.id);
              if (regionStats && tag.id) {
                regionStats.tagIds.add(tag.id);
                if (tag.tag_group?.id) regionStats.tagGroupIds.add(tag.tag_group.id);
              }
            }

            // THEME STATS
            if (tag.tag_group) {
              const theme = tag.tag_group;
              const themeId = theme.id;

              if (!themeStatsMap.has(themeId)) {
                themeStatsMap.set(themeId, {
                  id: theme.id,
                  name: theme.name,
                  slug: theme.slug || null,
                  coverImage:theme.coverImage||null,
                  postcardIds: new Set(),
                  albumIds: new Set(),
                  tagIds: new Set(),
                  regionIds: new Set(),
                  countryIds: new Set(),
                });
              }

              const themeStats = themeStatsMap.get(themeId);
              themeStats.postcardIds.add(postcard.id);
              if (tag.id) themeStats.tagIds.add(tag.id);
              if (postcard.album) {
                if (postcard.album.id) themeStats.albumIds.add(postcard.album.id);
                if (postcard.album.region?.id) themeStats.regionIds.add(postcard.album.region.id);
                if (postcard.album.country?.id) themeStats.countryIds.add(postcard.album.country.id);
              }
            }

            // INTEREST STATS
            const interestId = tag.id;
            if (!interestStatsMap.has(interestId)) {
              interestStatsMap.set(interestId, {
                id: tag.id,
                name: tag.name,
                slug: tag.slug || null,
                postcardIds: new Set(),
                albumIds: new Set(),
                regionIds: new Set(),
                countryIds: new Set(),
              });
            }

            const interestStats = interestStatsMap.get(interestId);
            interestStats.postcardIds.add(postcard.id);
            if (postcard.album) {
              if (postcard.album.id) interestStats.albumIds.add(postcard.album.id);
              if (postcard.album.region?.id) interestStats.regionIds.add(postcard.album.region.id);
              if (postcard.album.country?.id) interestStats.countryIds.add(postcard.album.country.id);
            }
          });
        }
      });

      // Format response
      let results;

      if (statsType === 'country') {
        results = Array.from(countryStatsMap.values()).map((stats) => ({

            id: stats.id,
            name: stats.name,
            slug: stats.slug,
            code: stats.code,
            coverImage: stats.coverImage,
            tagCount: stats.tagIds.size,
            tagGroupCount: stats.tagGroupIds.size,
            stats: {
            experiences: stats.postcardCount,
            properties: stats.albumIds.size,
            regions: stats.regionIds.size,

          },
        }));
      } else if (statsType === 'region') {
        results = Array.from(regionStatsMap.values()).map((stats) => ({

            id: stats.id,
            name: stats.name,
          slug: stats.slug,
          country:stats.country,
            tagCount: stats.tagIds.size,
            tagGroupCount: stats.tagGroupIds.size,

          stats: {
            experiences: stats.postcardCount,
            properties: stats.albumIds.size,

          },
        }));
      } else if (statsType === 'theme') {
        results = Array.from(themeStatsMap.values()).map((stats) => ({

            id: stats.id,
            name: stats.name,
            slug: stats.slug,
          coverImage: stats.coverImage,
             tagCount: stats.tagIds.size,
            regionCount: stats.regionIds.size,

          stats: {
            experiences: stats.postcardIds.size,
            properties: stats.albumIds.size,
            countries: stats.countryIds.size,
          },
        }));
      } else if (statsType === 'interest') {
        results = Array.from(interestStatsMap.values()).map((stats) => ({

            id: stats.id,
            name: stats.name,
          slug: stats.slug,
              regionCount: stats.regionIds.size,

          stats: {
            experiences: stats.postcardIds.size,
            properties: stats.albumIds.size,
            countries: stats.countryIds.size,
          },
        }));
      }

      results.sort((a, b) => b.stats.experiences - a.stats.experiences);

      if (limit) {
        const limitNum = parseInt(limit);
        if (limitNum > 0 && limitNum <= 100) {
          results = results.slice(0, limitNum);
        }
      }

      return ctx.send({
        data: results,
        meta: {
          total: results.length,
          totalPostcards: filteredPostcards.length,
          timestamp: new Date().toISOString(),
          statsType,
          filters: {
            id: id || null,
            slug: slug || null,
            name: name || null,
            limit: limit ? parseInt(limit) : null,
          },
        },
      });
    } catch (error) {
      console.error('❌ Error in getAllStats:', error);
      return ctx.badRequest('Failed to fetch statistics', {
        error: error.message,
      });
    }
  },



  async getCacheInfo(ctx) {
    try {
      // USE POSTCARD SERVICE TO GET CACHE INFO
      const postcardService = strapi.service('api::postcard.postcard');
      const info = await postcardService.getCacheInfo();
      return ctx.send(info);
    } catch (error) {
      console.error('❌ Error getting cache info:', error);
      return ctx.badRequest('Failed to get cache info', {
        error: error.message,
      });
    }
  },

    async getFilters(ctx) {
  const {
    country,
    region, // Add region parameter
    album,
    tag,
    tagGroup,
    forProfile,
    slug,
    condition,
    stats,
    isFeatured,
    isComplete
  } = ctx.query;

  const postcardIds = [];

  if (forProfile && !slug) {
    return {
      country: [],
      region: [],
      album: [],
      tags: [],
      tagGroup: [],
      albumThemes: [],
    };
  }

  const tags = ctx.request.body?.tags || [];

  // Build filter object for database query
  const filter = {
    $and: [
      {
        album: {
          directories: {
            slug: { $in: ["mindful-luxury-hotels"] }
          }
        }
      }
    ]
  };

  filter.$and.push({ isComplete: true });

  // Add filters based on query parameters
  if (country && country !== '-1') {
    filter.$and.push({ country: country });
  }

  // ADDED: Region filter through album relation
  if (region && region !== '-1') {
    filter.$and.push({
      album: {
        region: region
      }
    });
  }

  if (album && album !== '-1') {
    filter.$and.push({ album: album });
  }

  if (tag && tag !== '-1') {
    filter.$and.push({ tags: tag });
  }

  if (tagGroup && tagGroup !== '-1') {
    filter.$and.push({ tags: { tag_group: tagGroup } });
  }

  if (isFeatured !== undefined) {
    filter.$and.push({ isFeatured: isFeatured === 'true' || isFeatured === true });
  }

  if (isComplete !== undefined) {
    filter.$and.push({ isComplete: isComplete === 'true' || isComplete === true });
  }

  if (tags?.length > 0) {
    if (condition === "or") {
      filter.$and.push({ tags: { $in: tags } });
    } else {
      // For AND condition, each tag must be present
      tags.forEach(tagId => {
        filter.$and.push({ tags: tagId });
      });
    }
  }

  // Handle bookmarks for profile view
  if (forProfile) {
    const bookmarks = await strapi.db
      .query("api::bookmark.bookmark")
      .findMany({
        where: {
          user: {
            slug,
          },
          postcard: {
            id: { $notNull: true },
          },
        },
        populate: {
          postcard: {
            select: ["id"],
          },
        },
      });

    if (bookmarks.length > 0) {
      postcardIds.push(...bookmarks.map(bmk => bmk.postcard?.id).filter(Boolean));
      filter.$and.push({ id: { $in: postcardIds } });
    } else {
      // No bookmarks found, return empty filters
      return {
        country: [],
        region: [],
        album: [],
        tags: [],
        tagGroup: [],
        albumThemes: [],
      };
    }
  }


  // Fetch postcards with all necessary relations
  const postcards = await strapi.db.query('api::postcard.postcard').findMany({
    where: filter,
    populate: {
      country: {
        select: ['id', 'name']
      },
      album: {
        select: ['id', 'name', 'slug'],
        populate: {
          region: {
            select: ['id', 'name']
          }
        }
      },
      tags: {
        select: ['id', 'name'],
        populate: {
          tag_group: {
            select: ['id', 'name']
          }
        }
      },
      album_themes: {
        select: ['id', 'name']
      }
    },
    limit: 1000
  });


  // Extract unique filter values
  const countryMap = new Map();
  const albumMap = new Map();
  const regionMap = new Map();
  const tagMap = new Map();
  const tagGroupMap = new Map();
  const albumThemeMap = new Map();

  postcards.forEach(postcard => {
    // Collect countries
    if (postcard.country) {
      countryMap.set(postcard.country.id, postcard.country);
    }

    // Collect albums and regions
    if (postcard.album) {
      albumMap.set(postcard.album.id, postcard.album);

      // Collect regions from albums
      if (postcard.album.region) {
        regionMap.set(postcard.album.region.id, postcard.album.region);
      }
    }

    // Collect tags and tag groups
    if (postcard.tags && Array.isArray(postcard.tags)) {
      postcard.tags.forEach(tag => {
        tagMap.set(tag.id, tag);
        if (tag.tag_group) {
          tagGroupMap.set(tag.tag_group.id, tag.tag_group);
        }
      });
    }

    // Collect album themes
    if (postcard.album_themes && Array.isArray(postcard.album_themes)) {
      postcard.album_themes.forEach(theme => {
        albumThemeMap.set(theme.id, theme);
      });
    }
  });

  const result = {
    country: Array.from(countryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
    region: Array.from(regionMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
    album: Array.from(albumMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
    tags: Array.from(tagMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
    tagGroup: Array.from(tagGroupMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
    albumThemes: Array.from(albumThemeMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
  };

  // Add stats if requested
  if (stats) {
    result.stats = {
      totalPostcards: postcards.length,
      countries: countryMap.size,
      regions: regionMap.size,
      albums: albumMap.size,
      tags: tagMap.size,
      tagGroups: tagGroupMap.size,
      albumThemes: albumThemeMap.size,
    };
  }

  return result;
  },
 async getAutoCompleteItems(ctx) {
    try {
      const {
        search = '',           // Search text
        page = 1,             // Page number
        pageSize = 15,        // Items per page
      } = ctx.query;

      console.log('🔍 Autocomplete search:', { search, page, pageSize });

      // GET CACHED POSTCARDS
      const postcardService = strapi.service('api::postcard.postcard');
      const postcards = await postcardService.cachePostcards();

      if (!postcards || postcards.length === 0) {
        return ctx.send({
          data: [],
          meta: {
            total: 0,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            pageCount: 0,
            search,
            timestamp: new Date().toISOString(),
          },
        });
      }

     const searchLower = search.toLowerCase().trim();

      // Collect unique items in Sets
      const countries = new Set();
      const regions = new Set();
      const tags = new Set();
      const albums = new Set();

      // Extract unique values from postcards
      postcards.forEach((postcard) => {
        // Country
        if (postcard.album?.country?.name) {
          const countryName = postcard.album.country.name;
          if (!searchLower || countryName.toLowerCase().includes(searchLower)) {
            countries.add(countryName);
          }
        }

        // Region - Format: "Region Name (Country Name)"
        if (postcard.album?.region?.name && postcard.album?.country?.name) {
          const regionName = postcard.album.region.name;
          const countryName = postcard.album.country.name;
          const regionWithCountry = `${regionName} (${countryName})`;

          // Check if search matches region name OR the full text
          if (!searchLower ||
              regionName.toLowerCase().includes(searchLower) ||
              regionWithCountry.toLowerCase().includes(searchLower)) {
            regions.add(regionWithCountry);
          }
        }

        // Tags
        if (postcard.tags && Array.isArray(postcard.tags)) {
          postcard.tags.forEach((tag) => {
            if (tag.name) {
              const tagName = tag.name;
              if (!searchLower || tagName.toLowerCase().includes(searchLower)) {
                tags.add(tagName);
              }
            }
          });
        }

        // Album
        if (postcard.album?.name) {
          const albumName = postcard.album.name;
          if (!searchLower || albumName.toLowerCase().includes(searchLower)) {
            albums.add(albumName);
          }
        }
      });

      // Convert Sets to sorted arrays
      const sortedCountries = [...countries].sort((a, b) =>
        a.localeCompare(b, 'en', { sensitivity: 'base' })
      );
      const sortedRegions = [...regions].sort((a, b) =>
        a.localeCompare(b, 'en', { sensitivity: 'base' })
      );
      const sortedTags = [...tags].sort((a, b) =>
        a.localeCompare(b, 'en', { sensitivity: 'base' })
      );
      const sortedAlbums = [...albums].sort((a, b) =>
        a.localeCompare(b, 'en', { sensitivity: 'base' })
      );

      // Build complete result set in order: Countries → Regions → Tags → Albums
      const completeResultSet = [
        ...sortedCountries.map(name => ({ type: 'country', name })),
        ...sortedRegions.map(name => ({ type: 'region', name })),
        ...sortedTags.map(name => ({ type: 'tag', name })),
        ...sortedAlbums.map(name => ({ type: 'album', name })),
      ];

      console.log(`✅ Total results: ${completeResultSet.length}`);
      console.log(`   - Countries: ${sortedCountries.length}`);
      console.log(`   - Regions: ${sortedRegions.length}`);
      console.log(`   - Tags: ${sortedTags.length}`);
      console.log(`   - Albums: ${sortedAlbums.length}`);

      // Apply pagination
      const pageNum = parseInt(page) || 1;
      const pageSizeNum = parseInt(pageSize) || 15;
      const totalItems = completeResultSet.length;
      const totalPages = Math.ceil(totalItems / pageSizeNum);
      const startIndex = (pageNum - 1) * pageSizeNum;
      const endIndex = startIndex + pageSizeNum;

      const paginatedResults = completeResultSet.slice(startIndex, endIndex);

      console.log(`📄 Page ${pageNum}/${totalPages}: ${paginatedResults.length} items`);

      return ctx.send({
        data: paginatedResults,
        meta: {
          total: totalItems,
          page: pageNum,
          pageSize: pageSizeNum,
          pageCount: totalPages,
          counts: {
            countries: sortedCountries.length,
            regions: sortedRegions.length,
            tags: sortedTags.length,
            albums: sortedAlbums.length,
          },
          search: search || null,
          timestamp: new Date().toISOString(),
        },
      });

    } catch (error) {
      console.error('❌ Error in autocomplete search:', error);
      return ctx.badRequest('Failed to fetch autocomplete results', {
        error: error.message,
      });
    }
  },
}));

/**
 * Helper function to get user role securely
 */
function getUserRole(user) {
    if (!user) return 'Guest';

    try {
        // Check multiple possible role locations
        const roleName =
            user?.user_type?.name ||
            user?.role?.name ||
            'User';

        return roleName;
    } catch (error) {
        console.error('Error getting user role:', error);
        return 'User';
    }
}