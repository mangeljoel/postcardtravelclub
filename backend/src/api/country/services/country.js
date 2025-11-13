'use strict';

/**
 * country service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::country.country', ({ strapi }) => ({
    async extractUniqueContries(items) {
        const countrySet = new Set()
        const countries = []
        items.forEach((item) => {
            if (item?.country) {
                if (!countrySet.has(item.country.id)) {
                    countries.push(item.country)
                    countrySet.add(item.country.id)
                }
            }
        })
        return countries.sort((a, b) => a.name.localeCompare(b.name))
    },
}));
