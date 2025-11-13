'use strict';

/**
 * tag-group controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tag-group.tag-group', ({ strapi }) => ({
    async getTagGroups(ctx) {
        const countryId = ctx.query?.country
        const type = ctx.query?.type
        const slug = ctx.query?.profile
        const resultFor = ctx.query?.resultFor
        const aff = ctx.query?.affiliation

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

        let filter = { $and: [] }

        if (countryId) {
            filter.$and.push({
                country: countryId
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
            populate: {
                tags: {
                    select: ["id", "name"],
                    populate: {
                        tag_group: {
                            select: ["id", "name"]
                        }
                    }
                }
            }
        })
        const tagGroups = await
            strapi.service('api::tag-group.tag-group').getTagGroupsByPostcards(postcards);
        const sortedTagGroups = tagGroups.sort((a, b) => a.name.localeCompare(b.name))
        return sortedTagGroups
    }
}));
