'use strict';
const redisClient = require("../../../utils/redis");
const { KEYS } = require('../../../constants/redis.constant');

/**
 *  tag controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tag.tag', ({ strapi }) => ({


    async getOrCreate(ctx) {
        if (!ctx.query.list)
            return ctx.body = { "error": "no tag names provided" }

        const tagGroup = ctx.query.tagGroup
        let allTags = ctx.query.list.map(tag => decodeURI(tag).trim().toLowerCase());

        let tags = await strapi.db.query("api::tag.tag")
            .findMany({
                where: {
                    name: {
                        $in: allTags
                    }
                }

            },
            );

        let tagIdList = [];
        let tagList = []
        tags.map(tag => {
            tagList.push(tag.name.toLowerCase()); // Normalize existing tags for comparison
            tagIdList.push(tag.id)
        });

        if (tags.length == allTags.length) {
            return tagIdList;
        } else {
            for (let i = 0; i < allTags.length; i++) {
                const tag = allTags[i];
                // Check for existence without case sensitivity and after trimming spaces
                if (!tagList.includes(tag) && tag.length > 2 && tag != "undefined" && tagGroup) { // 'Undefined' check normalized to lowercase
                    const newTag = await strapi.db.query("api::tag.tag")
                        .create({
                            data: {
                                name: tag,
                                tag_group: tagGroup
                            },
                        });
                    tagIdList.push(newTag.id);
                }
            }
            strapi.service('api::album.album').cacheAlbums();
            return tagIdList;
        }
    },

    async getTagsIfAlbumInCountry(albumId, countryId) {
        try {
            const albumData = await redisClient.getConnection().hGet('albums', albumId);
            if (albumData) {
                const album = JSON.parse(albumData);

                if ((album.country.id == countryId || countryId == 0) && album.postcards?.length > 0) {
                    const tags = new Set();
                    for (const postcard of album.postcards) {
                        postcard.tags?.forEach(tag => tags.add(tag.name?.toLowerCase()));
                    }
                    return Array.from(tags);
                }
            }
            return []; // Return an empty array if the album is not in the specified country or has no data
        } catch (error) {
            console.error('Error in getTagsIfAlbumInCountry:', error);
            return []; // Handle the error appropriately
        }
    },
    async getTagsbyDirectory(ctx) {
        const directoryslug = ctx.query.directory;
        const startsWith = ctx.query.startswith;
        let countryId = ctx.query.country;
        const tags = ctx.query.taglist?.split(',');

        if (!directoryslug)
            return ctx.body = { "error": "no directory provided" }

        if (!countryId)
            countryId = 0;
        // return ctx.body= {"error": "no Country provided"}

        const sortedTagKey = `${KEYS.COUNTRY}:${countryId}:${KEYS.DIRECTORY}:${directoryslug}:sortedTags`;

        let tagList = [];
        if (startsWith) {
            tagList = await redisClient.getConnection().sMembers(`${KEYS.COUNTRY}:${countryId}:${KEYS.DIRECTORY}:${directoryslug}`);
            const regex = new RegExp(`^${startsWith}`, 'i');
            tagList = tagList.filter(tag => regex.test(tag.toLowerCase()));
        } else {
            try {
                let allTagsWithScores = await redisClient.getConnection().zRangeByScore(sortedTagKey, 0, 999999);

                tagList = allTagsWithScores.reverse();//.slice(0, 30);
            } catch (error) {
                console.error('Redis ZRANGE error:', error);
                return []; // Or handle the error as appropriate
            }
        }

        if (tags && tags.length > 0) {
            // Get album IDs for each tag and find common albums
            const albumIdsPerTag = await Promise.all(tags.map(async tag => {
                return await redisClient.getConnection().sMembers(`pctag:${tag.trim().toLowerCase()}`);
            }));
            const commonAlbumIds = albumIdsPerTag.reduce((a, b) => a.filter(c => b.includes(c)));

            // Accumulate tags from the albums in the common list and within the given country
            const tagOccurrences = new Map();
            for (const albumId of commonAlbumIds) {
                const albumTags = await this.getTagsIfAlbumInCountry(albumId, countryId);
                albumTags.forEach(tag => {
                    tagOccurrences.set(tag, (tagOccurrences.get(tag) || 0) + 1);
                });
            }

            // Sort the tags by their occurrence and get the top 10
            const topTags = Array.from(tagOccurrences)
                // .sort((a, b) => b[1] - a[1])
                // .slice(0,30)
                .map(item => item[0])
                .sort();

            return topTags;
        }

        return tagList.sort();
    },

    async getTags(ctx) {
        const countryId = ctx.query?.country
        const categoryList = ctx.query?.category?.split(',') || []
        const tagGroup = ctx.query?.tagGroup
        const type = ctx.query?.type
        const slug = ctx.query?.profile
        const resultFor = ctx.query?.resultFor
        const aff = ctx.query?.affiliation
        // const postcardList = ctx.query?.postcard?.split(',') || []
        // const albumList = ctx.query?.album?.split(',') || []

        let directories;
        if (type == "hotels") {
            directories = {
                slug: { $in: ["mindful-luxury-hotels"] }
            }
        } else if (type == "tours") {
            directories = {
                slug: { $in: ["mindful-luxury-tours"] }
            }
        }

        let filter = {
            $and: [],
        };

        if (countryId) {
            filter.$and.push({ country: countryId });
        }
        if (categoryList.length > 0) {
            filter.$and.push({
                album: {
                    category: {
                        id: {
                            $in: categoryList,
                        },
                    },
                },
            });
        }
        if (tagGroup) {
            filter.$and.push({
                tags: {
                    tag_group: tagGroup
                }
            })
        }
        if (slug) {
            if (resultFor == "postcards") {
                filter.$and.push({
                    bookmarks: { user: { slug } },
                })
            }
            else {
                filter.$and.push({
                    album: { follow_albums: { follower: { slug } } },
                })
            }
        }
        if (aff) {
            filter.$and.push({ album: { company: { affiliations: aff } } });
        }

        filter.$and.push({
            album: {
                isActive: true,
                ...(directories ? { directories } : {})
            },
            isComplete: true
        })
        const postcards = await strapi.query('api::postcard.postcard').findMany({
            where: filter,
            select: ["id"],
            populate: {
                tags: {
                    select: ["id", "name"]
                }
            }

        })

        const tags = await strapi.service('api::tag.tag').extractTagsFromPostcards(postcards)
        const sortedTags = tags
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tag) => ({
                ...tag,
                name: tag.name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
            }));
        return sortedTags

    }

}));
