"use strict";

/**
 * event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  async getStats(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }
    const fullUser = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { id: user.id },
        populate: {
          user_type: true,
          albums: {
            select: ["id", "name"],
            populate: {
              follow_albums: true,
              company: true,
              postcards: {
                select: ["id"],
                populate: {
                  follow_albums: true,
                  company: true,
                  bookmarks: true,
                },
              },
            },
          },
        },
      });
    if (!fullUser) {
      return ctx.unauthorized();
    }
    let albumStats = [];
    if (
      fullUser.user_type?.slug == "admin-1" ||
      fullUser.user_type?.slug == "super-admin"
    ) {
      const allAlbums = await strapi.db.query("api::album.album").findMany({
        populate: {
          follow_albums: true,
          company: true,
          postcards: {
            select: ["id"],
            populate: { follow_albums: true, company: true, bookmarks: true },
          },
        },
      });

      if (allAlbums) {
        for (let i = 0; i < allAlbums?.length; i++) {
          const album = allAlbums[i];
          const followCount = album.follow_albums
            ? album.follow_albums.length
            : 0;
          const visitCount = await strapi.db.query("api::event.event").count({
            where: {
              event_master: 2,
              album: {
                id: album.id,
              },
            },
          });

          let bookmarksCount = album.postcards.reduce((count, postcard) => {
            return count + (postcard.bookmarks ? postcard.bookmarks.length : 0);
          }, 0);

          albumStats.push({
            id: album.id,
            name: album.name,
            company: album.company?.name,
            follow_count: followCount,
            visit_count: visitCount,
            postcards_count: album.postcards?.length,
            postcards_collected_count: bookmarksCount,
          });
        }
      }
    } else if (
      fullUser.user_type?.slug == "hotels" ||
      fullUser.user_type?.slug == "tour-operators" ||
      fullUser.user_type?.slug == "story-teller"
    ) {
      if (fullUser.albums) {
        for (let i = 0; i < fullUser.albums?.length; i++) {
          const album = fullUser.albums[i];

          const followCount = album.follow_albums
            ? album.follow_albums.length
            : 0;

          const visitCount = await strapi.db.query("api::event.event").count({
            where: {
              event_master: 2,
              album: {
                id: album.id,
              },
            },
          });

          let bookmarksCount = album.postcards.reduce((count, postcard) => {
            return count + (postcard.bookmarks ? postcard.bookmarks.length : 0);
          }, 0);

          albumStats.push({
            id: album.id,
            name: album.name,
            follow_count: followCount,
            visit_count: visitCount,
            postcards_count: album.postcards?.length,
            postcards_collected_count: bookmarksCount,
          });
        }
      }
    } else {
      return ctx.unauthorized();
    }

    return albumStats;
  },
  async getTotalStats() {
    // Query for follow counts in parallel
    const [
      websiteCount,
      albumCount,
      bkmCount,
      albumFollowCount,
      affiliateFollowCount,
      companyFollowCount,
    ] = await Promise.all([
      strapi.db.query("api::event.event").count({
        where: {
          event_master: 1,
        },
      }),
      strapi.db.query("api::event.event").count({
        where: {
          event_master: 2,
        },
      }),
      strapi.db.query("api::bookmark.bookmark").count({
        where: {
          user: { id: { $notNull: true } },
        },
      }),
      strapi.db.query("api::follow-album.follow-album").count({
        where: {
          follower: { id: { $notNull: true } },
        },
      }),
      strapi.db.query("api::follow-affiliate.follow-affiliate").count({
        where: {
          follower: { id: { $notNull: true } },
        },
      }),
      strapi.db.query("api::follow-company.follow-company").count({
        where: {
          follower: { id: { $notNull: true } },
        },
      }),
    ]);

    // Add follow counts to the event counts
    let eventCounts = {
      websiteCount: websiteCount ?? 0,
      albumCount: albumCount ?? 0,
      bkmCount: bkmCount ?? 0,
      albumFollowCount: albumFollowCount ?? 0,
      affiliateFollowCount: affiliateFollowCount ?? 0,
      companyFollowCount: companyFollowCount ?? 0,
    };
    return eventCounts;
  },
  async getAffilStats(ctx) {
    if (ctx.query.id) {
      let affilId = ctx.query.id;

      const [websiteCount, albumCount, bkmCount, affiliateFollowCount] =
        await Promise.all([
          strapi.db.query("api::event.event").count({
            where: {
              $and: [
                { event_master: 1 },
                {
                  $or: [
                    {
                      postcard: {
                        album: {
                          company: {
                            affiliations: {
                              id: { $in: [affilId] },
                            },
                          },
                        },
                      },
                    },
                    {
                      album: {
                        company: {
                          affiliations: {
                            id: { $in: [affilId] },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          }),
          strapi.db.query("api::event.event").count({
            where: {
              event_master: 2,
              album: {
                company: {
                  affiliations: {
                    id: { $in: [affilId] },
                  },
                },
              },
            },
          }),

          strapi.db.query("api::bookmark.bookmark").count({
            where: {
              postcard: {
                album: {
                  company: {
                    affiliations: {
                      id: { $in: [affilId] },
                    },
                  },
                },
              },
            },
          }),
          strapi.db.query("api::follow-affiliate.follow-affiliate").count({
            where: {
              affiliation: {
                id: affilId,
              },
            },
          }),
        ]);
      return {
        websiteCount: websiteCount ?? 0,
        albumCount: albumCount ?? 0,
        bkmCount: bkmCount ?? 0,
        affiliateFollowCount: affiliateFollowCount ?? 0,
      };
    }
  },
  async getCompStats(ctx) {
    if (ctx.query.id) {
      let compId = ctx.query.id;
      const [websiteCount, albumCount, bkmCount, companyFollowCount] =
        await Promise.all([
          strapi.db.query("api::event.event").count({
            where: {
              $and: [
                { event_master: 1 },
                {
                  $or: [
                    {
                      postcard: {
                        album: {
                          company: {
                            id: compId,
                          },
                        },
                      },
                    },
                    {
                      album: {
                        company: {
                          id: compId,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          }),
          strapi.db.query("api::event.event").count({
            where: {
              event_master: 2,
              album: {
                company: {
                  id: compId,
                },
              },
            },
          }),

          strapi.db.query("api::bookmark.bookmark").count({
            where: {
              postcard: {
                album: {
                  company: {
                    id: compId,
                  },
                },
              },
            },
          }),
          strapi.db.query("api::follow-company.follow-company").count({
            where: {
              company: {
                id: compId,
              },
            },
          }),
        ]);
      return {
        websiteCount: websiteCount ?? 0,
        albumCount: albumCount ?? 0,
        bkmCount: bkmCount ?? 0,
        companyFollowCount: companyFollowCount ?? 0,
      };
    }
  },
  async getAlbumStats(ctx) {
    if (ctx.query.id) {
      let albumId = ctx.query.id;
      const [websiteCount, albumCount, bkmCount, albumFollowCount] =
        await Promise.all([
          strapi.db.query("api::event.event").count({
            where: {
              $and: [
                { event_master: 1 },
                {
                  $or: [
                    {
                      postcard: {
                        album: {
                          id: albumId,
                        },
                      },
                    },
                    {
                      album: {
                        id: albumId,
                      },
                    },
                  ],
                },
              ],
            },
          }),
          strapi.db.query("api::event.event").count({
            where: {
              event_master: 2,
              album: {
                id: albumId,
              },
            },
          }),

          strapi.db.query("api::bookmark.bookmark").count({
            where: {
              postcard: {
                album: {
                  id: albumId,
                },
              },
            },
          }),
          strapi.db.query("api::follow-album.follow-album").count({
            where: {
              album: {
                id: albumId,
              },
            },
          }),
        ]);
      return {
        websiteCount: websiteCount ?? 0,
        albumCount: albumCount ?? 0,
        bkmCount: bkmCount ?? 0,
        albumFollowCount: albumFollowCount ?? 0,
      };
    }
  },
  async getPostcardStats(ctx) {
    if (ctx.query.id) {
      let pcId = ctx.query.id;
      let pc = await strapi.db.query("api::postcard.postcard").findOne({
        where: { id: pcId },
        populate: {
          album: {
            select: ["id"],
            populate: {
              follow_albums: true,
            },
          },
        },
      });

      const [websiteCount, albumCount, bkmCount] = await Promise.all([
        strapi.db.query("api::event.event").count({
          where: {
            event_master: 1,
            postcard: { id: pcId },
          },
        }),
        strapi.db.query("api::event.event").count({
          where: {
            event_master: 2,
            postcard: { id: pcId },
          },
        }),

        strapi.db.query("api::bookmark.bookmark").count({
          where: {
            postcard: { id: pcId },
          },
        }),
      ]);
      return {
        websiteCount: websiteCount ?? 0,
        albumCount: albumCount ?? 0,
        bkmCount: bkmCount ?? 0,
        albumFollowCount: pc?.album?.follow_albums
          ? pc?.album?.follow_albums.length
          : 0,
      };
    }
  },

  async getAlbumsSorted(ctx) {
    const { sortBy = "albumCount", order = "desc", page = 0, pageSize = 10, company, country, propertyId, tags } = ctx.query;
    const tagList = tags ? tags.split(",") : [];
    const validSortFields = ["websiteCount", "albumCount", "bkmCount", "albumFollowCount"];

    if (!validSortFields.includes(sortBy)) {
      return ctx.badRequest("Invalid sort field");
    }

    // Fetch all matching album IDs first
    const albumIds = await strapi.db.query("api::album.album").findMany({
      where: {
        isFeatured: true,
        isActive: true,
        ...(country ? { country } : {}),
        ...(company ? { company } : {}),
        ...(propertyId ? { id: propertyId } : {}),
        ...(tagList.length > 0 ? { postcards: { tags: { id: { $in: tagList } } } } : {})
      },
      select: ["id"] // Only fetch album IDs for performance
    });

    // Compute album stats
    const albumStats = await Promise.all(
      albumIds.map(async ({ id }) => {
        const [websiteCount, albumCount, bkmCount, albumFollowCount] = await Promise.all([
          strapi.db.query("api::event.event").count({
            where: {
              $and: [
                { event_master: 1 },
                {
                  $or: [
                    { postcard: { album: { id } } },
                    { album: { id } },
                  ],
                },
              ],
            },
          }),
          strapi.db.query("api::event.event").count({
            where: { event_master: 2, album: { id } },
          }),
          strapi.db.query("api::bookmark.bookmark").count({
            where: { postcard: { album: { id } } },
          }),
          strapi.db.query("api::follow-album.follow-album").count({
            where: { album: { id } },
          }),
        ]);

        return {
          id,
          websiteCount,
          albumCount,
          bkmCount,
          albumFollowCount,
        };
      })
    );

    // Sort before pagination
    const sortedAlbums = albumStats.sort((a, b) => (order === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]));

    // Apply pagination correctly
    const paginatedAlbumIds = sortedAlbums.slice(page * pageSize, (page + 1) * pageSize).map(album => album.id);

    // Fetch the actual album data for only the paginated IDs (ensuring limited results)
    const paginatedAlbums = await strapi.db.query("api::album.album").findMany({
      where: { id: { $in: paginatedAlbumIds } },
      select: ["name"], // Fetch only the 'name' field for albums
      populate: {
        country: { select: ["id", "name"] }, // Fetch only 'name' for country
        company: { select: ["id", "name"] }, // Assuming you need ID & name
        coverImage: { select: ["url"] }, // Fetch only 'url' for coverImage
        postcards: {
          select: ["id"],
          populate: {
            tags: { select: ["id", "name"] } // Fetch only 'name' for tags
          }
        }
      }
    });

    const result = paginatedAlbumIds?.map(id => ({
      ...paginatedAlbums.find(album => album.id === id),
      ...albumStats.find(stats => stats.id === id)
    })).slice(0, pageSize);

    const finalResult = await Promise.all(
      result.map(async ({ postcards, ...album }) => ({
        ...album,
        postcardsCount: postcards.length,
        tags: await strapi.service("api::tag.tag").extractTagsFromPostcards(postcards),
      }))
    );

    return { result: finalResult, total: sortedAlbums.length };
  },
  async getPostcardsSorted(ctx) {
    const { sortBy = "albumCount", order = "desc", page = 0, pageSize = 10, company, country, propertyId, tags } = ctx.query;
    const tagList = tags ? tags.split(",") : [];
    const validSortFields = ["websiteCount", "albumCount", "bkmCount", "albumFollowCount"];

    if (!validSortFields.includes(sortBy)) {
      return ctx.badRequest("Invalid sort field");
    }

    // Fetch all matching album IDs first
    const pcIds = await strapi.db.query("api::postcard.postcard").findMany({
      where: {
        album: {
          isActive: true,
          ...(propertyId ? { id: propertyId } : {}),
          ...(company ? { company } : {}),
        },
        isComplete: true,
        ...(country ? { country } : {}),
        ...(tagList.length > 0 ? { postcards: { tags: { id: { $in: tagList } } } } : {})
      },
      populate: {
        album: {
          select: ["id"],
          populate: {
            follow_albums: {
              select: ["id"] // Only select IDs from follow_albums
            }
          }
        }
      },
      select: ["id"] // Only fetch postcard IDs
    });

    // Compute album stats
    const pcStats = await Promise.all(
      pcIds.map(async ({ id, album }) => {
        const [websiteCount, albumCount, bkmCount] = await Promise.all([
          strapi.db.query("api::event.event").count({
            where: {
              event_master: 1,
              postcard: { id },
            },
          }),
          strapi.db.query("api::event.event").count({
            where: {
              event_master: 2,
              postcard: { id },
            },
          }),

          strapi.db.query("api::bookmark.bookmark").count({
            where: {
              postcard: { id },
            },
          }),
        ]);
        return {
          id,
          websiteCount: websiteCount ?? 0,
          albumCount: albumCount ?? 0,
          bkmCount: bkmCount ?? 0,
          albumFollowCount: album?.follow_albums
            ? album?.follow_albums.length
            : 0,
        };
      })
    );

    // Sort before pagination
    const sortedPcs = pcStats.sort((a, b) => (order === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]));

    const paginatedPcIds = sortedPcs.slice(page * pageSize, (page + 1) * pageSize).map(pc => pc.id);

    const paginatedPcs = await strapi.db.query("api::postcard.postcard").findMany({
      where: { id: { $in: paginatedPcIds } },
      select: ["name"],
      populate: {
        album: {
          select: ["id", "name"],
          populate: {
            company: { select: ["id", "name"] }, // Assuming you need ID & name
          }
        },
        coverImage: { select: ["url"] }, // Fetch only 'url' for coverImage
        tags: { select: ["id", "name"] } // Fetch only 'name' for tags
      }
    });

    const result = paginatedPcIds?.map(id => ({
      ...paginatedPcs.find(pc => pc.id === id),
      ...pcStats.find(stats => stats.id === id)
    })).slice(0, pageSize);

    return { result, total: sortedPcs.length };
  }

}));
