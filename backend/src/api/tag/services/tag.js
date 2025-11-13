'use strict';

/**
 * tag service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tag.tag', ({ strapi }) => ({
    async extractTagsFromPostcards(postcards) {
        const tagSet = new Set();
        const tags = [];

        postcards.forEach((postcard) => {
            const tagList = postcard.tags;
            if (tagList && tagList.length > 0) {
                for (const tag of tagList) {
                    if (tag && !tagSet.has(tag.id)) {
                        tags.push(tag);
                        tagSet.add(tag.id);
                    }
                }
            }
        });

        return tags;
    }
}));
