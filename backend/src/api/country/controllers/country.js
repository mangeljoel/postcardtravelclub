'use strict';

const category = require('../../category/routes/category');

/**
 *  country controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::country.country', ({ strapi }) => ({
    async getCountries(ctx) {
        const tags = ctx.query.tags?.split(',') || [];
        const type = ctx.query?.type;
        const slug = ctx.query?.profile;
        const resultFor = ctx.query?.resultFor;
        const aff = ctx.query?.affiliation;

        // ✅ Special case for Destination Experts
        if (type === 'dx') {
            const dxs = await strapi.entityService.findMany('api::destination-expert.destination-expert', {
                filters: {
                    status: 'published',
                },
                fields: ['id'],
                populate: {
                    country: {
                        fields: ['id', 'name'],
                    },
                },
            });

            return await strapi.service('api::country.country').extractUniqueContries(dxs) || [];
        }
        if (type === "memories") {
            let filter = {}
            if (slug) filter = {user: { slug: slug } }
     const memories = await strapi.entityService.findMany('api::memory.memory', {
                filters:filter,
                populate: {
                    country: {
                        fields: ['id', 'name'],
                    },
                },
            });
            return await strapi.service('api::country.country').extractUniqueContries(memories) || [];
}
        // Define directories based on the type
        const directories = type === 'hotels'
            ? { slug: { $in: ['mindful-luxury-hotels'] } }
            : type === 'tours'
                ? { slug: { $in: ['mindful-luxury-tours'] } }
                : null;

        // Helper to build filters dynamically
        const buildFilter = () => {
            const filter = { $and: [] };

            if (tags.length > 0) {
                const tagCondition = resultFor === 'postcards'
                    ? { tags: { id: { $in: tags } } }
                    : { postcards: { tags: { id: { $in: tags } } } };
                filter.$and.push(tagCondition);
            }

            if (slug) {
                const slugCondition = resultFor === 'postcards'
                    ? { bookmarks: { user: { slug } } }
                    : { follow_albums: { follower: { slug } } };
                filter.$and.push(slugCondition);
            }

            if (aff) {
                const affCondition = resultFor === 'postcards'
                    ? { album: { company: { affiliations: aff } } }
                    : { company: { affiliations: aff } };
                filter.$and.push(affCondition);
            }

            const baseCondition = {
                isFeatured: true,
                isActive: true,
                ...(directories ? { directories } : {}),
            };
             const baseConditionforPc = {
                                isActive: true,
                ...(directories ? { directories } : {}),
            };

            if (resultFor === 'postcards') {
                filter.$and.push({
                    album: baseConditionforPc,
                    isComplete: true,
                });
            } else {
                filter.$and.push(baseCondition);
            }

            return filter;
        };

        // Common query execution logic
        const fetchEntities = async (modelName) => {
            const filter = buildFilter();
            const entities = await strapi.entityService.findMany(`api::${modelName}.${modelName}`, {
                filters: filter,
                fields: ['id'],
                populate: {
                    country: {
                        fields: ['id', 'name'],
                    },
                },
            });
            return entities;
        };

        const model = resultFor === 'postcards' ? 'postcard' : 'album';
        const entities = await fetchEntities(model);

        return await strapi.service('api::country.country').extractUniqueContries(entities) || [];
    },


    // GET /api/country/:countrySlug/:regionSlug
    // GET /api/country/:countrySlug/:regionSlug
    async getCountryRegionData(ctx) {
        try {
            const { countrySlug, regionSlug } = ctx.params;
            const { tab = 'all' } = ctx.query;

            console.log('🔥 Country Region Route Hit:', { countrySlug, regionSlug, tab });

            // Step 1: Find country by slug or name
            const countries = await strapi.entityService.findMany('api::country.country', {
                filters: {
                    $or: [
                        { slug: countrySlug },
                        { name: { $containsi: countrySlug } }
                    ]
                },
                fields: ['id', 'name', 'slug']
            });

            const country = Array.isArray(countries) ? countries[0] : countries;
            if (!country) {
                console.log('❌ Country not found:', countrySlug);
                return ctx.notFound('Country not found');
            }

            console.log('✅ Found country:', country);

            // Step 2: Find region by NAME ONLY (no slug field exists)
            const regionName = regionSlug.replace(/-/g, ' '); // Convert slug to name format
            const regions = await strapi.entityService.findMany('api::region.region', {
                filters: {
                    country: country.id,
                    name: { $containsi: regionName } // Only use name, no slug
                },
                fields: ['id', 'name'] // Remove slug from fields
            });

            const region = Array.isArray(regions) ? regions[0] : regions;
            if (!region) {
                console.log('❌ Region not found:', regionName, 'in country:', country.name);
                return ctx.notFound('Region not found in this country');
            }

            console.log('✅ Found region:', region);

            // Step 3: Build album filters based on tab
            let albumFilters = {
                isActive: true,
                country: country.id,
                region: region.id
            };

            // Add category filtering based on tab (adjust field names as needed)
            if (tab !== 'all') {
                switch (tab.toLowerCase()) {
                    case 'stays':
                        albumFilters.category = 'stay';
                        break;
                    case 'restaurants':
                        albumFilters.category = 'restaurant';
                        break;
                    case 'experiences':
                        albumFilters.category = 'experience';
                        break;
                }
            }

            console.log('🔍 Album filters:', albumFilters);

            // Step 4: Fetch albums for this region
            const albums = await strapi.entityService.findMany('api::album.album', {
                filters: albumFilters,
                populate: {
                    gallery: {
                        fields: ['id', 'url', 'caption']
                    },
                    country: {
                        fields: ['id', 'name', 'slug']
                    },
                    region: {
                        fields: ['id', 'name'] // Remove slug from region populate
                    },
                    user: {
                        fields: ['id', 'username', 'slug', 'fullName']
                    },
                    coverImage: {
                        fields: ['id', 'url']
                    }
                },
                sort: 'createdAt:desc'
            });

            console.log('📚 Found albums:', Array.isArray(albums) ? albums.length : (albums ? 1 : 0));

            // Step 5: Return structured response
            return {
                success: true,
                data: {
                    country,
                    region,
                    albums: Array.isArray(albums) ? albums : [albums].filter(Boolean),
                    meta: {
                        total: Array.isArray(albums) ? albums.length : (albums ? 1 : 0),
                        tab: tab
                    }
                }
            };

        } catch (error) {
            console.error('Error in getCountryRegionData:', error);
            return ctx.badRequest('Failed to fetch region data', {
                error: error.message
            });
        }
    }


}));
