"use strict";
const redisClient = require("../../../utils/redis");
const { KEYS } = require("../../../constants/redis.constant");
/**
 *  album controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::album.album", ({ strapi }) => ({
  /**
   *  Get all albums.
   */
  async find(ctx) {
    // some logic here
    const { data, meta } = await super.find(ctx);
    // some more logic
    if (data.length == 0) {
      if (ctx.query.filters?.slug) {
        ctx.query.filters.companySlug = ctx.query.filters.slug;
        delete ctx.query.filters.slug;
        const { data, meta } = await super.find(ctx);
        return { data, meta };
      }
    }
    return { data, meta };
  },
  async findCountries(ctx) {
    // some logic here
    let data = [];
    if (ctx.query.type == "hotels") {
      const hotelsdata = await strapi.db
        .query("api::directory.directory")
        .findOne({
          select: ["id"],
          where: { id: 2 },
          populate: {
            albums: {
              // where: { isActive: true },
              select: ["id"],
              populate: {
                country: true,
              },
            },
          },
        });
      data = hotelsdata?.albums;
    } else if (ctx.query.type == "tours") {
      const toursdata = await strapi.db
        .query("api::directory.directory")
        .findOne({
          select: ["id"],
          where: { id: 1 },
          populate: {
            albums: {
              // where: { isActive: true },
              select: ["id"],
              populate: {
                country: true,
              },
            },
          },
        });
      data = toursdata?.albums;
    } else if (ctx.query.type == "fnd") {
      const fnddata = await strapi.db
        .query("api::directory.directory")
        .findOne({
          select: ["id"],
          where: { id: 6 },
          populate: {
            albums: {
              // where: { isActive: true },
              select: ["id"],
              populate: {
                country: true,
              },
            },
          },
        });
      data = fnddata?.albums;
    } else if (ctx.query.type == "experience") {
      //to fetch countries for postcards only
      let postcards = await strapi.entityService.findMany("api::postcard.postcard", {
        filters: {
          isComplete: true,
          album: {directories:{    slug: { $in: [ "mindful-luxury-hotels"] }}},
        },
        fields: ["id"],
        populate: {
          album: {
            fields:["id","name"],
            populate: {
              country: {
                populate: {
                  coverImage: {fields:["url"]}}
            }
          }
        }},
      });
      let refAr=[] //to check duplicate
      postcards.forEach((element) => {
        // console.log(element);
      if (element.album?.id && !refAr.includes(element.album?.id)) {
        refAr.push(element.album?.id);
        data.push(element.album);
      }
    });

    } else {
      data = await strapi.entityService.findMany("api::album.album", {
        filters: {
          isFeatured: true,
          // isActive: true,
        },
        fields: ["id"],
        populate: "country",
      });
    }
    let countries = [];
    let result = [];
    data.forEach((element) => {
      if (element.country?.id && !countries.includes(element.country?.id)) {
        countries.push(element.country?.id);
        result.push(element.country);
      }
    });
    return result;
  },
  async getCountryStats(ctx){
  // Get optional country parameter from query
  const countryParam = ctx.query.country;

  let countries;

  if (countryParam) {
    // If country parameter is provided, filter for that specific country
    // This assumes countryParam could be either country name or ID
    const allCountries = await this.findCountries(ctx);

    // Filter by name or ID
    countries = allCountries.filter(country =>
      country.name === countryParam ||
      country.id === parseInt(countryParam) ||
      country.id === countryParam
    );

    // If no country found with the given parameter, return empty array or error
    if (countries.length === 0) {
      return [];
      // Or you could throw an error:
      // throw new Error(`Country "${countryParam}" not found`);
    }
  } else {
    // If no country parameter, fetch all countries
    countries = await this.findCountries(ctx);
  }

  // Prepare an array to store final results
  const results = [];

  for (const country of countries) {
    // Create a clean query object to avoid mutation issues
    const statsQuery = {
      ...ctx.query,
      country: country?.id,
      stats: true
    };

    // Create a new context object with the updated query
    const statsCtx = {
      ...ctx,
      query: statsQuery
    };

    // Wait for getFilters to resolve
    const filters = await this.getFilters(statsCtx);

    // Attach filters result to country object
    results.push({
      ...country,
      ...filters, // or name it `filtersResult`, `details`, etc.
    });
  }

  return results;
},

  async findbyTag(ctx) {
    if (!ctx.query.tag || ctx.query.tag.length < 3) {
      return (ctx.body = { error: "invalid tag" });
    }

    // Split the tag query parameter into an array of tags
    const tags = ctx.query.tag.split(",");

    // Retrieve album IDs for each tag and store them in an array
    let albumIdsPerTag = await Promise.all(
      tags.map(async (tag) => {
        return await redisClient
          .getConnection()
          .sMembers(`pctag:${tag.trim().toLowerCase()}`);
      })
    );
    // console.log("albumIdsPerTag",albumIdsPerTag)

    // Find the intersection of all album ID arrays (albums that have all tags)
    const commonAlbumIds = albumIdsPerTag.reduce((a, b) =>
      a.filter((c) => b.includes(c))
    );

    // Retrieve the album details
    const albums = await Promise.all(
      commonAlbumIds.map((id) => redisClient.getConnection().hGet("albums", id))
    );
    let result = albums.map((album) => JSON.parse(album));

    // Filter by country if the query parameter is present
    if (ctx.query.country) {
      result = result.filter((album) => album.country.id == ctx.query.country);
    }

    return result;
  },

  async getTags(ctx) {
    if (!ctx.query.albumId) {
      return (ctx.body = { error: "invalid album" });
    }
    const albumId = ctx.query.albumId;
    const albumData = await redisClient.getConnection().hGet("albums", albumId);
    const tags = new Set(); // Use a Set to avoid duplicate tags
    const album = JSON.parse(albumData);
    return (
      (await strapi
        .service("api::tag.tag")
        .extractTagsFromPostcards(album?.postcards || [])) || []
    );
  },
  async getAlbumswithFilters(ctx) {
    const { type, country, region, environment, cuisines } = ctx.query;
    return [];
  },

  async getAlbums(ctx) {
    const {
      country,
      type,
      region,
      environment,
      category,
      tagGroup,
      selectedTag,
      selectedCuisine,
      slug,
      affiliation,
      searchText,
      page = 1,
      pageSize = 6,
    } = ctx.query;
    const tags = ctx.request.body?.tags || [];
    const cuisines = ctx.request.body?.cuisines || [];

    const filter = {
      $and: [
        {
          isFeatured: true,
          // isActive: true,
          // on_boarding: { state: "approved" },
          directories: {
            slug: { $in: [type ? type : "mindful-luxury-hotels"] },
          },
        },
      ],
    };

    if (country) filter.$and.push({ country });
    if (region) filter.$and.push({ region });
    if (environment) filter.$and.push({ environment });
    if (category) filter.$and.push({ category });
    if (tagGroup)
      filter.$and.push({ postcards: { tags: { tag_group: tagGroup } } });

    if (selectedTag) filter.$and.push({ postcards: { tags: selectedTag } });
    if (selectedCuisine)
      filter.$and.push({ cuisines: { id: { $in: [selectedCuisine] } } });
    else if (tags?.length > 0)
      filter.$and.push({ postcards: { tags: { id: { $in: tags } } } });
    else if (cuisines?.length > 0)
      filter.$and.push({ cuisines: { id: { $in: cuisines } } });

    if (slug) filter.$and.push({ follow_albums: { follower: { slug } } });
    if (searchText) filter.$and.push({  $or: [
      { name: { $containsi: searchText } },
      { country: { name: { $containsi: searchText } } },
      { region: { name: { $containsi: searchText } } }
    ] });

    if (affiliation)
      filter.$and.push({ company: { affiliations: { id: affiliation } } });
    // Pagination variables
    const pageNum = Number(page);
    const limit = Number(pageSize);
    const start = (pageNum - 1) * limit;

    const albums = await strapi.db.query("api::album.album").findMany({
      where: filter,
      populate: {
        coverImage: { fields: ["url"] },

        bestMonth: true,
        avgPricePerPerson: true,
        fixedDates: true,
        album_themes: true,
        user: { fields: ["slug"] },
        news_article: {
          fields: ["id", "status", "title", "url"],
          populate: {
            image: { fields: ["id", "url"] },
            creator: { fields: ["fullName", "id"] },
            blog: { fields: ["title", "content"] },
            block: {
              populate:{
                album_section: {feilds : ["id"]}
              }
            },
            assignto: { fields: ["id", "username", "fullname"] },
          },
        },
        postcards: {
          fields: ["id"],
          populate: {
            tags: {
              fields: ["id", "name"],
            },
          },
        },
        company: {
          fields: ["name"],
          populate: {
            affiliations: {
              populate: {
                companies: { fields: ["name"] },
                logo: { fields: ["url"] },
              },
            },
            icon: {
              populate: ["url"],
            },
          },
        },
        country: { fields: ["name"] },
        environment: { fields: ["id", "name"] },
        category: { fields: ["name"] },
        region: { fields: ["name"] },
        follow_albums: { populate: ["follower"] },
        cuisines: { fields: ["id", "name"] },
      },
      orderBy: { updatedAt: "desc" },
      limit,
      offset: start,
    });

    const result = Promise.all(
      albums.map(async (album) => {
        const tags = await strapi
          .service("api::tag.tag")
          .extractTagsFromPostcards(album.postcards || [], tagGroup);
        delete album.postcards; // Remove postcards field
        return { ...album, tags };
      })
    );

    return result;
  },

  async getFilters(ctx) {
    const {
      country,
      region,
      env,
      category,
      tagGroup,
      forProfile,
      slug,
      affiliation,
      condition,
      stats
    } = ctx.query;
    const postcards = [];
    if (forProfile && !slug) {
      return {
        country: [],
        region: [],
        environment: [],
        category: [],
        tags: [],
        tagGroup: [],
      };
    }
    const tags = ctx.request.body?.tags || [];
    const queryParts = [];

    if (country) queryParts.push(`@country_id:[${country} ${country}]`);
    if (region) queryParts.push(`@region_id:[${region} ${region}]`);
    if (env) queryParts.push(`@environment_id:[${env} ${env}]`);
    if (category) queryParts.push(`@category_id:[${category} ${category}]`);
    if (affiliation)
      queryParts.push(`@affiliation_id:[${affiliation} ${affiliation}]`);
    if (tagGroup) queryParts.push(`@tag_group_id:[${tagGroup} ${tagGroup}]`);
    if (tags?.length > 0) {
      const temp = tags?.map((tag) => `@tag_id:[${tag} ${tag}]`);
      queryParts.push(`(${temp.join(" | ")})`);
    }

    if (forProfile) {
      if (forProfile == "postcards") {
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
        const temp = [];
        for (const bmk of bookmarks) {
          temp.push(`@postcard_id:[${bmk.postcard?.id} ${bmk.postcard?.id}]`);
          postcards.push(bmk.postcard?.id);
        }
        queryParts.push(`(${temp.join(" | ")})`);
      } else {
        const followAlbums = await strapi.db
          .query("api::follow-album.follow-album")
          .findMany({
            where: {
              follower: {
                slug,
              },
              album: {
                id: { $notNull: true },
              },
            },
            populate: {
              album: {
                select: ["id"],
              },
            },
          });
        const temp = followAlbums?.map(
          (fol) => `@id:[${fol.album?.id} ${fol.album?.id}]`
        );
        queryParts.push(`(${temp.join(" | ")})`);
      }
    }

    await redisClient.connect();
    const redisConn = redisClient.getConnection();
    const records = await redisConn.sendCommand([
      "FT.SEARCH",
      "idx:filters",
      ...(queryParts.length === 0
        ? ["*"]
        : [`'${queryParts.join(condition == "or" ? " | " : " ")}'`]),
      "LIMIT",
      "0",
      "1000",
    ]);

    return await strapi
      .service("api::album.album")
      .extractFiltersFromAlbums(
        records,
        tagGroup,
        forProfile == "postcards",
        postcards,stats
      );
  },

  escapeRediSearchText(text) {
    return text
      .replace(/([@\-&|{}\[\]"':;!?*()\\])/g, "\\$1")
      .replace(/\s+/g, "\\ ");
  },

  async getAutoCompleteItems(ctx) {
    const {
      type = "albums",
      search = "",
      tag,
      affiliation,
      page = 1,
      pageSize = 15,
    } = ctx.query;

    await redisClient.connect();
    const redisConn = redisClient.getConnection();
    const query = [];

    if (search.trim().length > 1) {
      const trimmed = search.trim();
      if (type === "albums") {
        query.push(`(@album_name:(*${trimmed}*)) | (@country_name:(*${trimmed}*)) | (@region_name:(*${trimmed}*))`);
      } else if (type === "postcards") {
        query.push(
          `(@tag_name:(*${trimmed}*)) | (@album_name:(*${trimmed}*)) | (@country_name:(*${trimmed}*)) | (@region_name:(*${trimmed}*))`
        );
      } else {
        return [];
      }
    }

    if (tag) query.push(`@tag_id:[${tag} ${tag}]`);
    if (affiliation)
      query.push(`@affiliation_id:[${affiliation} ${affiliation}]`);

    const offset = (page - 1) * pageSize;

    const records = await redisConn.sendCommand([
      "FT.SEARCH",
      "idx:filters",
      query.length ? query.join(" ") : "*",
      "SORTBY",
      "album_name",
      "ASC",
      "LIMIT",
      String(offset),
      String(pageSize),
    ]);


    if (records.length <= 1) return [];

    const albums = new Set();
  const countries = new Set();
  const regions = new Set();
    const tags = new Set();
      const searchLower = search.toLowerCase();

   for (let i = 1; i < records.length; i += 2) {
    const jsonStr = records[i + 1][3];
    if (!jsonStr) continue;

     let data;
     let filteredData;
     try { data = JSON.parse(jsonStr); } catch { continue; }
     if (tag) {
  const hasTagInAlbum = Array.isArray(data.postcards) && data.postcards.some(pc =>
    Array.isArray(pc.tags) && pc.tags.some(t => String(t.id) === String(tag))
  );
  if (!hasTagInAlbum) continue;
}
if (affiliation) {
  // If album doesn't have this affiliation, skip it
  const hasAffil = Array.isArray(data.company?.affiliations) &&
                   data.company.affiliations.some(a => String(a.id) === String(affiliation));
  if (!hasAffil) continue; // skip this album completely
}
    // 🔹 Check each field individually against search
    if (data.name?.toLowerCase().includes(searchLower)) albums.add(data.name);
    if (data.country?.name?.toLowerCase().includes(searchLower)) countries.add(data.country.name);
    if (data.region?.name?.toLowerCase().includes(searchLower)) regions.add(data.region.name+" ("+ data.country.name+")");

    if (type === "postcards" && Array.isArray(data.postcards)) {
      for (const postcard of data.postcards) {
        if ( Array.isArray(postcard.tags)) {
          for (const tagObj of postcard.tags) {
            if (tagObj.name?.toLowerCase().includes(searchLower)) tags.add(tagObj.name);
          }
        }
      }
    }
  }
  const resultSet = (type === "albums")? [
    ...[...albums].map(text => ({ type: "album", text })),
    ...[...countries].map(text => ({ type: "country", text })),
    ...[...regions].map(text => ({ type: "region", text })),
  ]: [
    ...[...albums].map(text => ({ type: "album", text })),
    ...[...countries].map(text => ({ type: "country", text })),
    ...[...regions].map(text => ({ type: "region", text })),
    ...[...tags].map(text => ({ type: "tag", text }))
  ];

  return { resultSet };

},

// Get Region Stats
async getRegionStats(ctx) {
  try {
    const { region } = ctx.query;

    if (!region) {
      return ctx.badRequest('Region parameter is required');
    }

    // Decode and format the region value
    const formattedRegion = this.decodeFilterValue(region);

    console.log(`Fetching stats for region: ${formattedRegion}`);

    // Query albums with postcards and their tags
    const albums = await strapi.db.query('api::album.album').findMany({
      where: {
        region: {
          name: {
            $eq: formattedRegion,
          },
        },
      },
      populate: {
        postcards: {
          populate: {
            tags: true, // Populate tags from postcards
          },
        },
        region: {
          select: ['id', 'name'],
        },
      },
    });

    console.log(`Found ${albums.length} albums in region: ${formattedRegion}`);

    // Calculate stats
    const uniqueTags = new Set();
    let totalPostcards = 0;

    albums.forEach(album => {
      // Count postcards
      if (album.postcards && album.postcards.length > 0) {
        totalPostcards += album.postcards.length;

        // Count unique tags from postcards
        album.postcards.forEach(postcard => {
          if (postcard.tags && postcard.tags.length > 0) {
            postcard.tags.forEach(tag => {
              uniqueTags.add(tag.id || tag);
            });
          }
        });
      }
    });

    console.log(`Stats - Albums: ${albums.length}, Tags: ${uniqueTags.size}, Postcards: ${totalPostcards}`);

    return {
      region: formattedRegion,
      numberOfAlbums: albums.length,
      numberOfInterests: uniqueTags.size, // Changed from numberOfInterests
      numberOfPostcards: totalPostcards,
    };
  } catch (error) {
    console.error('getRegionStats error:', error);
    ctx.throw(500, error.message || 'Failed to fetch region stats');
  }
},

async getThemeStats(ctx) {
  try {
    const { theme } = ctx.query;

    if (!theme) {
      return ctx.badRequest('Theme parameter is required');
    }

    // Decode and format the theme value (tag_group name)
    const formattedTheme = this.decodeFilterValue(theme);

    console.log(`Fetching stats for theme/tag_group: ${formattedTheme}`);

    // First, find the tag_group by name
    const tagGroup = await strapi.db.query('api::tag-group.tag-group').findOne({
      where: {
        name: {
          $containsi: formattedTheme,
        },
      },
      select: ['id', 'name'],
    });

    if (!tagGroup) {
      console.log(`Tag group "${formattedTheme}" not found`);
      return {
        theme: formattedTheme,
        numberOfAlbums: 0,
        numberOfInterests: 0,
        numberOfPostcards: 0,
      };
    }

    console.log(`Found tag_group with ID: ${tagGroup.id}`);

    // Get all tags that belong to this tag_group
    const tags = await strapi.db.query('api::tag.tag').findMany({
      where: {
        tag_group: {
          id: tagGroup.id,
        },
      },
      select: ['id', 'name'],
    });

    console.log(`Found ${tags.length} tags in tag_group: ${formattedTheme}`);

    if (tags.length === 0) {
      return {
        theme: formattedTheme,
        numberOfAlbums: 0,
        numberOfInterests: tags.length,
        numberOfPostcards: 0,
      };
    }

    const tagIds = tags.map(tag => tag.id);

    // Query all albums with their postcards and tags
    const albums = await strapi.db.query('api::album.album').findMany({
      populate: {
        postcards: {
          populate: {
            tags: {
              select: ['id', 'name'],
            },
          },
        },
        country: {
          select: ['id', 'name'],
        },
      },
    });

    console.log(`Found ${albums.length} total albums, filtering by tag_group...`);

    // Filter albums and calculate stats
    const uniqueAlbumIds = new Set();
    const uniqueCountryIds = new Set();
    let totalPostcardsWithTheme = 0;

    albums.forEach(album => {
      let albumHasTheme = false;

      if (album.postcards && album.postcards.length > 0) {
        album.postcards.forEach(postcard => {
          if (postcard.tags && postcard.tags.length > 0) {
            // Check if any tag in this postcard belongs to our tag_group
            const hasThemeTag = postcard.tags.some(tag => tagIds.includes(tag.id));

            if (hasThemeTag) {
              totalPostcardsWithTheme++;
              albumHasTheme = true;
            }
          }
        });
      }

      // If album has at least one postcard with a tag from this tag_group
      if (albumHasTheme) {
        uniqueAlbumIds.add(album.id);

        if (album.country?.id) {
          uniqueCountryIds.add(album.country.id);
        }
      }
    });

    console.log(`Stats - Albums: ${uniqueAlbumIds.size}, Interests: ${tags.length}, Postcards: ${totalPostcardsWithTheme}`);

    return {
      theme: formattedTheme,
      numberOfAlbums: uniqueAlbumIds.size,
      numberOfInterests: tags.length, // Number of tags in this tag_group
      numberOfPostcards: totalPostcardsWithTheme,
    };
  } catch (error) {
    console.error('getThemeStats error:', error);
    ctx.throw(500, error.message || 'Failed to fetch theme stats');
  }
},

async getInterestStats(ctx) {
  try {
    const { interest } = ctx.query;

    if (!interest) {
      return ctx.badRequest('Interest parameter is required');
    }

    // Decode and format the interest value
    const formattedInterest = this.decodeFilterValue(interest);

    console.log(`Fetching stats for interest/tag: ${formattedInterest}`);

    // First, find the tag by name using LIKE (case-insensitive contains)
    const tag = await strapi.db.query('api::tag.tag').findOne({
      where: {
        name: {
          $containsi: formattedInterest,
        },
      },
      select: ['id', 'name'],
    });

    if (!tag) {
      console.log(`Tag "${formattedInterest}" not found`);
      return {
        interest: formattedInterest,
        numberOfAlbums: 0,
        numberOfCountries: 0,
        numberOfPostcards: 0,
      };
    }

    console.log(`Found tag with ID: ${tag.id}`);

    // Query all albums with their postcards and nested tags
    const albums = await strapi.db.query('api::album.album').findMany({
      where: {
        // Optional: add filters like isFeatured, isActive if needed
      },
      populate: {
        postcards: {
          populate: {
            tags: {
              select: ['id', 'name'],
            },
          },
        },
        country: {
          select: ['id', 'name'],
        },
      },
    });

    console.log(`Found ${albums.length} total albums, filtering by tag...`);

    // Filter and calculate stats
    const uniqueAlbumIds = new Set();
    const uniqueCountryIds = new Set();
    let totalPostcardsWithTag = 0;

    albums.forEach(album => {
      let albumHasTag = false;

      if (album.postcards && album.postcards.length > 0) {
        album.postcards.forEach(postcard => {
          // Check if this postcard has the specific tag (using contains for flexible matching)
          if (postcard.tags && postcard.tags.length > 0) {
            const hasTag = postcard.tags.some(t =>
              t.id === tag.id ||
              (t.name && t.name.toLowerCase().includes(formattedInterest.toLowerCase()))
            );

            if (hasTag) {
              totalPostcardsWithTag++;
              albumHasTag = true;
            }
          }
        });
      }

      // If album has at least one postcard with the tag, count it
      if (albumHasTag) {
        uniqueAlbumIds.add(album.id);

        if (album.country?.id) {
          uniqueCountryIds.add(album.country.id);
        }
      }
    });

    console.log(`Found ${totalPostcardsWithTag} postcards with tag: ${formattedInterest}`);
    console.log(`Stats - Albums: ${uniqueAlbumIds.size}, Countries: ${uniqueCountryIds.size}, Postcards: ${totalPostcardsWithTag}`);

    return {
      interest: formattedInterest,
      numberOfAlbums: uniqueAlbumIds.size,
      numberOfCountries: uniqueCountryIds.size,
      numberOfPostcards: totalPostcardsWithTag,
    };
  } catch (error) {
    console.error('getInterestStats error:', error);
    ctx.throw(500, error.message || 'Failed to fetch interest stats');
  }
},

 async getAllCountriesStats(ctx) {
    try {
      // Get all countries

      const countries = await this.findCountries(ctx);

      if (!countries || countries.length === 0) {
        return [];
      }

      // Prepare results array
      const results = [];

      for (const country of countries) {
        // Query albums for this country
        const albums = await strapi.db.query('api::album.album').findMany({
          where: {
            country: { id: country.id },
            isFeatured: true,
          },
          populate: {
            postcards: {
              select: ['id'],
            },
            region: {
              select: ['id', 'name'],
            },
          },
        });

        // Calculate stats
        const uniqueRegions = new Set();
        let totalExperiences = 0; // postcards
        let totalStays = 0; // albums of type stays

        albums.forEach(album => {
          // Count stays (albums)
          totalStays++;

          // Count experiences (postcards)
          if (album.postcards && album.postcards.length > 0) {
            totalExperiences += album.postcards.length;
          }

          // Track unique regions
          if (album.region?.id) {
            uniqueRegions.add(album.region.id);
          }
        });

        // Build result object with nested stats
        results.push({
          id: country.id,
          name: country.name,
          stats: {
            experiences: totalExperiences,
            stays: totalStays,
            regions: uniqueRegions.size,
          }
        });
      }

      return results;
    } catch (error) {
      console.error('getAllCountriesStats error:', error);
      ctx.throw(500, error.message || 'Failed to fetch all countries stats');
    }
  },

  async getAllRegionsStats(ctx) {
    try {
      // Get all regions
      const regions = await strapi.db.query('api::region.region').findMany({
        select: ['id', 'name'],
      });

      if (!regions || regions.length === 0) {
        return [];
      }

      const results = [];

      for (const region of regions) {
        // Query albums for this region
        const albums = await strapi.db.query('api::album.album').findMany({
          where: {
            region: { id: region.id },
            isFeatured: true,
          },
          populate: {
            postcards: {
              select: ['id'],
            },
          },
        });

        // Calculate stats
        let totalExperiences = 0; // postcards
        let totalStays = albums.length; // albums

        albums.forEach(album => {
          if (album.postcards && album.postcards.length > 0) {
            totalExperiences += album.postcards.length;
          }
        });

        // Build result object with nested stats
        results.push({
          id: region.id,
          name: region.name,
          stats: {
            experiences: totalExperiences,
            stays: totalStays,
          }
        });
      }

      return results;
    } catch (error) {
      console.error('getAllRegionsStats error:', error);
      ctx.throw(500, error.message || 'Failed to fetch all regions stats');
    }
  },

  async getAllThemesStats(ctx) {
    try {
      // Get optional country filter from query
      const { country } = ctx.query;

      // Get all tag groups (themes)
      const tagGroups = await strapi.db.query('api::tag-group.tag-group').findMany({
        select: ['id', 'name'],
      });

      if (!tagGroups || tagGroups.length === 0) {
        return [];
      }

      const results = [];

      for (const tagGroup of tagGroups) {
        // Get all tags belonging to this tag group
        const tags = await strapi.db.query('api::tag.tag').findMany({
          where: {
            tag_group: { id: tagGroup.id },
          },
          select: ['id', 'name'],
        });

        const tagIds = tags.map(tag => tag.id);

        // Skip if no tags in this group
        if (tagIds.length === 0) {
          continue;
        }

        // Build where clause with optional country filter
        const whereClause = {
          isFeatured: true,
          directories: {
            slug: { $in: ["mindful-luxury-hotels"] }
          },
        };

        // Add country filter if provided
        if (country) {
          whereClause.country = { id: parseInt(country) || country };
        }

        // Query all albums with postcards
        const albums = await strapi.db.query('api::album.album').findMany({
          where: whereClause,
          populate: {
            postcards: {
              populate: {
                tags: {
                  select: ['id'],
                },
              },
            },
            country: {
              select: ['id'],
            },
          },
        });

        // Calculate stats
        const uniqueAlbumIds = new Set();
        const uniqueCountryIds = new Set();
        let totalExperiences = 0;

        albums.forEach(album => {
          let albumHasTheme = false;

          if (album.postcards && album.postcards.length > 0) {
            album.postcards.forEach(postcard => {
              if (postcard.tags && postcard.tags.length > 0) {
                const hasThemeTag = postcard.tags.some(tag => tagIds.includes(tag.id));

                if (hasThemeTag) {
                  totalExperiences++;
                  albumHasTheme = true;
                }
              }
            });
          }

          if (albumHasTheme) {
            uniqueAlbumIds.add(album.id);
            if (album.country?.id) {
              uniqueCountryIds.add(album.country.id);
            }
          }
        });

        // Only add to results if this theme has actual data
        if (totalExperiences > 0 || uniqueAlbumIds.size > 0) {
          results.push({
            id: tagGroup.id,
            name: tagGroup.name,
            stats: {
              experiences: totalExperiences,
              stays: uniqueAlbumIds.size,
              countries: uniqueCountryIds.size,
            }
          });
        }
      }

      return results;
    } catch (error) {
      console.error('getAllThemesStats error:', error);
      ctx.throw(500, error.message || 'Failed to fetch all themes stats');
    }
  },
  async getAllInterestsStats(ctx) {
    try {
      // Get optional country filter from query
      const { country } = ctx.query;

      // Get all tags (interests)
      const tags = await strapi.db.query('api::tag.tag').findMany({
        select: ['id', 'name'],
      });

      if (!tags || tags.length === 0) {
        return [];
      }

      const results = [];

      // Build where clause with optional country filter
      const whereClause = {
        isFeatured: true,
        directories: {
          slug: { $in: ["mindful-luxury-hotels"] }
        },
      };

      // Add country filter if provided
      if (country) {
        whereClause.country = { id: parseInt(country) || country };
      }

      // Query all albums once (for performance)
      const albums = await strapi.db.query('api::album.album').findMany({
        where: whereClause,
        populate: {
          postcards: {
            populate: {
              tags: {
                select: ['id'],
              },
            },
          },
          country: {
            select: ['id'],
          },
        },
      });

      // Process each tag
      for (const tag of tags) {
        const uniqueAlbumIds = new Set();
        const uniqueCountryIds = new Set();
        let totalExperiences = 0;

        albums.forEach(album => {
          let albumHasTag = false;

          if (album.postcards && album.postcards.length > 0) {
            album.postcards.forEach(postcard => {
              if (postcard.tags && postcard.tags.length > 0) {
                const hasTag = postcard.tags.some(t => t.id === tag.id);

                if (hasTag) {
                  totalExperiences++;
                  albumHasTag = true;
                }
              }
            });
          }

          if (albumHasTag) {
            uniqueAlbumIds.add(album.id);
            if (album.country?.id) {
              uniqueCountryIds.add(album.country.id);
            }
          }
        });

        // Only add to results if this interest has actual data
        if (totalExperiences > 0 || uniqueAlbumIds.size > 0) {
          results.push({
            id: tag.id,
            name: tag.name,
            stats: {
              experiences: totalExperiences,
              stays: uniqueAlbumIds.size,
              countries: uniqueCountryIds.size,
            }
          });
        }
      }

      return results;
    } catch (error) {
      console.error('getAllInterestsStats error:', error);
      ctx.throw(500, error.message || 'Failed to fetch all interests stats');
    }
  },

  // Keep existing helper methods
  decodeFilterValue(filterValue) {
    if (!filterValue) return "";

    let str = decodeURIComponent(filterValue);
    str = str.replace(/-/g, " ");
    str = str.replace(/_/g, ", ");
    str = str.replace(/\band\b/g, "&");

    str = str
      .split(" ")
      .map((word) => {
        if (!word) return "";
        if (word === "&" || word.length === 1) return word;

        if (word.endsWith(",")) {
          const wordWithoutComma = word.slice(0, -1);
          return wordWithoutComma.charAt(0).toUpperCase() + wordWithoutComma.slice(1).toLowerCase() + ",";
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");

    return str.replace(/\s+/g, " ").trim();
  },

  // Keep existing helper methods
  decodeFilterValue(filterValue) {
    if (!filterValue) return "";

    let str = decodeURIComponent(filterValue);
    str = str.replace(/-/g, " ");
    str = str.replace(/_/g, ", ");
    str = str.replace(/\band\b/g, "&");

    str = str
      .split(" ")
      .map((word) => {
        if (!word) return "";
        if (word === "&" || word.length === 1) return word;

        if (word.endsWith(",")) {
          const wordWithoutComma = word.slice(0, -1);
          return wordWithoutComma.charAt(0).toUpperCase() + wordWithoutComma.slice(1).toLowerCase() + ",";
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");

    return str.replace(/\s+/g, " ").trim();
  },

  // Keep existing helper methods
  decodeFilterValue(filterValue) {
    if (!filterValue) return "";

    let str = decodeURIComponent(filterValue);
    str = str.replace(/-/g, " ");
    str = str.replace(/_/g, ", ");
    str = str.replace(/\band\b/g, "&");

    str = str
      .split(" ")
      .map((word) => {
        if (!word) return "";
        if (word === "&" || word.length === 1) return word;

        if (word.endsWith(",")) {
          const wordWithoutComma = word.slice(0, -1);
          return wordWithoutComma.charAt(0).toUpperCase() + wordWithoutComma.slice(1).toLowerCase() + ",";
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");

    return str.replace(/\s+/g, " ").trim();
  },

// Helper function - add this to your controller
decodeFilterValue(filterValue) {
  if (!filterValue) return "";

  let str = decodeURIComponent(filterValue);
  str = str.replace(/-/g, " ");
  str = str.replace(/_/g, ", ");
  str = str.replace(/\band\b/g, "&");

  str = str
    .split(" ")
    .map((word) => {
      if (!word) return "";
      if (word === "&" || word.length === 1) return word;

      if (word.endsWith(",")) {
        const wordWithoutComma = word.slice(0, -1);
        return wordWithoutComma.charAt(0).toUpperCase() + wordWithoutComma.slice(1).toLowerCase() + ",";
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  return str.replace(/\s+/g, " ").trim();
},
}));
