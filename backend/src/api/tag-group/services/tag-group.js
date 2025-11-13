'use strict';

/**
 * tag-group service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tag-group.tag-group', ({ strapi }) => ({
    async getTagGroupsByPostcards(postcards) {
        const tagGroupSet = new Set()
        const tagGroups = []

        postcards.forEach((postcard) => {
            if (postcard?.tags?.length > 0) {
                for (const tag of postcard.tags) {
                    if (tag.tag_group && !tagGroupSet.has(tag.tag_group.id)) {
                        tagGroups.push(tag.tag_group)
                        tagGroupSet.add(tag.tag_group.id)
                    }
                }
            }
        })
        return tagGroups
    }
}));