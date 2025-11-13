'use strict';

/**
 * category service
 */
const redisClient = require('../../../utils/redis')
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::category.category', ({ strapi }) => ({
    async extractUniqueCategories(albums) {
        const categorySet = new Set()
        const categories = []

        albums.forEach((album) => {
            if (album.category && !categorySet.has(album.category.id)) {
                categories.push(album.category)
                categorySet.add(album.category.id)
            }
        })
        return categories
    },
    async getAlbumsByTags(tagList) {
        const albumIds = []
        for (const tag of tagList) {
            albumIds.push(...await redisClient.getConnection().sMembers(`pctag:${tag.name.trim()}`))
        }

        return albumIds
    }
}));
