'use strict';

/**
 * category controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::category.category', ({ strapi }) => ({
    async getCategories(ctx) {
        const countryId = ctx.query.country
        // const tagGroupList = ctx.query?.tagGroup?.split(',') || []
        const tagList = ctx.query?.tags?.split(',') || []
        // const postcardList = ctx.query?.postcard?.split(',') || []
        // const albumList = ctx.query?.album?.split(',') || []

        let filter = {
            $and: []
        }

        if (countryId) {
            filter.$and.push({ country: countryId })
        }
        if (tagList?.length > 0) {
            const tags = await strapi.query('api::tag.tag').findMany({
                where: {
                    id: {
                        $in: tagList
                    }
                },
                select: ["id", "name"]
            })
            filter.$and.push({
                id: { $in: await strapi.service('api::category.category').getAlbumsByTags(tags) }
            })
        }
        const albums = await strapi.query('api::album.album').findMany({
            where: filter,
            debug: true,
            select: ["id"],
            populate: {
                category: {
                    select: ["id", "name"],
                }
            }
        })
        return await strapi.service('api::category.category').extractUniqueCategories(albums)

    }
}));
