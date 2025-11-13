"use strict";
const redisClient = require("../../../utils/redis");
const { KEYS } = require("../../../constants/redis.constant");

/**
 * album service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::album.album", ({ strapi }) => ({


  async cacheAlbums() {
    await redisClient.connect();

    const albums = await strapi.db.query("api::album.album").findMany({
      select: ["id", "name", "lat", "long", "slug"],
      populate: {
        company: {
          select: ["id", "name"]
        },
        country: {
          select: ["id", "name"]
        },
        directories: {
          select: ["id", "slug"]
        },
        coverImage: {
          select: ["url"]
        },

        postcards: {
          select: ["id", "publishedAt"],
          populate: {
            tags: {
              select: ["id", "name"]
            },
          },
        }
      },
    });


    for (let id = 0; id <= 500; id++) {
      await redisClient.getConnection().del(`${KEYS.COUNTRY}:${id}:${KEYS.DIRECTORY}:mindful-luxury-hotels`);
      await redisClient.getConnection().del(`${KEYS.COUNTRY}:${id}:${KEYS.DIRECTORY}:mindful-luxury-tours`);
      await redisClient.getConnection().del(`${KEYS.COUNTRY}:${id}:${KEYS.DIRECTORY}:mindful-luxury-tours:sortedTags`);
      await redisClient.getConnection().del(`${KEYS.COUNTRY}:${id}:${KEYS.DIRECTORY}:mindful-luxury-hotels:sortedTags`);
      await redisClient.getConnection().del(`${KEYS.COUNTRY}:${id}:${KEYS.DIRECTORY}:retreats`);
      await redisClient.getConnection().del(`${KEYS.COUNTRY}:${id}:${KEYS.DIRECTORY}:retreats:sortedTags`);
      await redisClient.getConnection().del(`${KEYS.COUNTRY}:${id}:${KEYS.DIRECTORY}:glamping`);
      await redisClient.getConnection().del(`${KEYS.COUNTRY}:${id}:${KEYS.DIRECTORY}:glamping:sortedTags`);
    }


    const keys = await redisClient.getConnection().keys('pctag:*');
    if (keys.length > 0)
      await redisClient.getConnection().del(keys);

    await redisClient.getConnection().del(KEYS.ALBUMS);

    for (const album of albums) {
      // Save each album in Redis
      try {
        const type = await redisClient.getConnection().type(KEYS.ALBUMS);

        if (type === 'none' || type === 'hash') {
          // It's safe to use hSet
          const albumData = JSON.stringify(album);
          await redisClient.getConnection().hSet(KEYS.ALBUMS, album.id.toString(), albumData);

        } else {
          // Handle the scenario where KEYS.ALBUMS is not a hash
          console.error(`Key ${KEYS.ALBUMS} is not a hash, it's a ${type}`);
          // Consider how to handle this - maybe delete the key, notify an admin, etc.
        }

        if (!album.directories || album.directories?.length == 0) continue;
        if (!album.country) continue;

        // For each tag in the album's postcards, add the album ID to the tag's set
        album.postcards.forEach(postcard => {
          if (postcard.publishedAt == null) return;
          postcard.tags.forEach(async tag => {
            const tagKey = `pctag:${tag.name}`;

            const countryDirectoryKey = `${KEYS.COUNTRY}:${album.country.id}:${KEYS.DIRECTORY}:${album.directories[0]?.slug}`;
            const country0DirectoryKey = `${KEYS.COUNTRY}:0:${KEYS.DIRECTORY}:${album.directories[0]?.slug}`;
            // Increment the score for the tag in the sorted set
            const sortedTagKey = `${KEYS.COUNTRY}:${album.country?.id}:${KEYS.DIRECTORY}:${album.directories[0].slug}:sortedTags`;
            await redisClient.getConnection().zIncrBy(sortedTagKey, 1, tag.name);


            const sorted0TagKey = `${KEYS.COUNTRY}:0:${KEYS.DIRECTORY}:${album.directories[0].slug}:sortedTags`;
            await redisClient.getConnection().zIncrBy(sorted0TagKey, 1, tag.name);

            // Cache the tag for the album
            const type = await redisClient.getConnection().type(tagKey);
            if (type === 'none' || type === 'set') {
              await redisClient.getConnection().sAdd(tagKey, album.id.toString());
            } else {
              console.error(`Key ${tagKey} is not a set, it's a ${type}`);
              // Handle the scenario appropriately
            }

            // Cache the tag for the country and directory
            if (album.country && album.directories) {
              album.directories.forEach(async directory => {
                await redisClient.getConnection().sAdd(countryDirectoryKey, tag.name);
                await redisClient.getConnection().sAdd(country0DirectoryKey, tag.name);
              });
            }
          });
        });


      } catch (error) {
        console.error(error + album.id);
      }
    }
  },

  async cacheAlbumFilter() {
    try {
      await redisClient.connect();
      const redisConn = redisClient.getConnection();

      // **1. Delete existing index if it exists**
      try {
        await redisConn.sendCommand(["FT.DROPINDEX", "idx:filters", "DD"]);
        // console.log("Existing index deleted.");
      } catch (err) {
        // console.log("No existing index to delete, continuing...");
      }

      // **2. Delete all existing filter keys**
      const existingKeys = await redisConn.keys("filter:*");
      if (existingKeys.length > 0) {
        await redisConn.del(existingKeys);
        // console.log(`Deleted ${existingKeys.length} existing filter records.`);
      }

      // **3. Fetch albums**
      const albums = await strapi.db.query("api::album.album").findMany({
        select: ["id", "name"],
        where: {
          isFeatured: true,
          // isActive: true,
          directories: { slug: { $in: ["mindful-luxury-hotels"] } },
        },
        populate: {
          country: { select: ["id", "name"] },
          environment: { select: ["id", "name"] },
          category: { select: ["id", "name"] },
          region: { select: ["id", "name"] },
          postcards: {
            select: ["id", "name"],
            populate: {
              tags: {
                select: ["id", "name"],
                populate: {
                  tag_group: { select: ["id", "name"] },
                },
              },
            },
          },
          company: {
            select: ["id"],
            populate: {
              affiliations: {
                select: ["id"]
              }
            },
          }
        },
      });

      // console.log(JSON.stringify(albums));

      // **4. Store albums in Redis**
      for (const album of albums) {
        await redisConn.json.set(`filter:${album.id}`, '$', album);
      }

      // **5. Create new index**
      await redisConn.sendCommand([
        "FT.CREATE",
        "idx:filters",
        "ON", "JSON",
        "PREFIX", "1", "filter:",
        "STOPWORDS", "0",
        "SCHEMA",
        // Root level album name
        "$.name", "AS", "album_name", "TEXT", "SORTABLE",
        // ID fields
        "$.id", "AS", "id", "NUMERIC", "SORTABLE",
        "$.country.id", "AS", "country_id", "NUMERIC", "SORTABLE",
         "$.region.id", "AS", "region_id", "NUMERIC", "SORTABLE",
        "$.environment.id", "AS", "environment_id", "NUMERIC", "SORTABLE",
        "$.category.id", "AS", "category_id", "NUMERIC", "SORTABLE",
        //album-level-name
        "$.country.name", "AS", "country_name", "TEXT", "SORTABLE",
          "$.region.name", "AS", "region_name", "TEXT", "SORTABLE",

        // Postcard-level name
        "$.postcards[*].id", "AS", "postcard_id", "NUMERIC", "SORTABLE",
        "$.postcards[*].name", "AS", "postcard_name", "TEXT", "SORTABLE",
        // Tags
        "$.postcards[*].tags[*].id", "AS", "tag_id", "NUMERIC", "SORTABLE",
        "$.postcards[*].tags[*].name", "AS", "tag_name", "TEXT", "SORTABLE",
        "$.postcards[*].tags[*].tag_group.id", "AS", "tag_group_id", "NUMERIC", "SORTABLE",
        // Company ID
        "$.company.id", "AS", "company_id", "NUMERIC", "SORTABLE",
        // Affiliation IDs (Array)
        "$.company.affiliations[*].id", "AS", "affiliation_id", "NUMERIC", "SORTABLE"
      ]);


      console.log("Index created successfully!");
    } catch (err) {
      console.error("Error: ", err);
    }
  },

  async extractFiltersFromAlbums(redisRecords, tagGroupId, forProfile, postcards = [],stats) {
    const result = {
      country: new Map(),
      region: new Map(),
      environment: new Map(),
      category: new Map(),
      tags: new Map(),
      tagGroup: new Map(),
      postcards:new Map()
    };

    if (redisRecords[0] == 0) {
      return {
        country: [],
        region: [],
        environment: [],
        category: [],
        tags: [],
        tagGroup: [],
        postcards:[]
      }
    }

    // Start from index 1, as records[0] is the total count
    for (let i = 1; i < redisRecords.length; i += 2) {
      const jsonData = JSON.parse(redisRecords[i + 1][1]);

      if (jsonData.country) result.country.set(jsonData.country.id, jsonData.country);
      if (jsonData.region) result.region.set(jsonData.region.id, jsonData.region);
      if (jsonData.environment) result.environment.set(jsonData.environment.id, jsonData.environment);
      if (jsonData.category) result.category.set(jsonData.category.id, jsonData.category);

      jsonData.postcards.forEach((postcard) => {
           result.postcards.set(postcard.id, postcard);
        if (!forProfile || postcards.includes(postcard.id)) {

          postcard.tags.forEach((tag) => {
            if (!tagGroupId || tag.tag_group.id == tagGroupId) {
              result.tags.set(tag.id, tag);
              result.tagGroup.set(tag.tag_group.id, tag.tag_group);
            }
          });
        }
      });
    }

    // Function to sort by name
    const sortByName = (a, b) => a.name.localeCompare(b.name);

    // Convert maps to arrays
    const finalResult = {
      country: Array.from(result.country.values()).sort(sortByName),
      region: Array.from(result.region.values()).sort(sortByName),
      environment: Array.from(result.environment.values()).sort(sortByName),
      category: Array.from(result.category.values()).sort(sortByName),
      tags: Array.from(result.tags.values()).sort(sortByName),
      tagGroup: Array.from(result.tagGroup.values()).sort(sortByName)
    };
    let finalStatResult = {

    }
    if (stats) {
      finalStatResult = {
        region: Array.from(result.region.values()).length,
        tags: Array.from(result.tags.values()).length,
        postcards: Array.from(result.postcards.values()).length,
        albums:redisRecords[0]

      }
    }
    return stats?finalStatResult:finalResult;
  }
}));
