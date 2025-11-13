'use strict';
const redisClient = require("../../../utils/redis");
/**
 * destination-expert service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::destination-expert.destination-expert', ({ strapi }) => ({
    async buildFilteredDxData(expertId, dxcards = []) {
        await redisClient.connect();
        const redisConn = redisClient.getConnection();
        const dxCardService = strapi.service("api::dx-card.dx-card");

        let staysParsed = [];
        let expsParsed = [];
        let restaurantsParsed = [];

        if (!dxcards.length) {
            const [staysRaw, expsRaw, resRaw] = await Promise.all([
                redisConn.sendCommand([
                    'FT.SEARCH',
                    'idx:dxcard',
                    `@dx_card_type_id:[2 2] @expert_id:[${expertId} ${expertId}]`,
                    'RETURN', '1', '$',
                ]),
                redisConn.sendCommand([
                    'FT.SEARCH',
                    'idx:dxcard',
                    `@dx_card_type_id:[1 1] @expert_id:[${expertId} ${expertId}]`,
                    'RETURN', '1', '$',
                ]),
                redisConn.sendCommand([
                    'FT.SEARCH',
                    'idx:dxcard',
                    `@dx_card_type_id:[3 3] @expert_id:[${expertId} ${expertId}]`,
                    'RETURN', '1', '$',
                ]),
            ]);

            const parseResults = redisClient.parseRedisSearchResults;
            staysParsed = parseResults(staysRaw) || [];
            expsParsed = parseResults(expsRaw) || [];
            restaurantsParsed = parseResults(resRaw) || [];
        } else {
            staysParsed = dxcards.filter(c => c?.dx_card_type?.id === 2);
            expsParsed = dxcards.filter(c => c?.dx_card_type?.id === 1);
            restaurantsParsed = dxcards.filter(c => c?.dx_card_type?.id === 3);
        }

        const [stayFilterDataRaw, expFilterDataRaw, resFilterDataRaw] = await Promise.all([
            dxCardService.prepareJsonForRedis(staysParsed, ["country", "region", "environment", "category"], false),
            dxCardService.prepareJsonForRedis(expsParsed, ["country", "region", "tag_group", "tags"], true),
            dxCardService.prepareJsonForRedis(restaurantsParsed, ["country", "region"], false),
        ]);

        const stayFilterData = dxCardService.transformNestedData(
            stayFilterDataRaw,
            ["countries", "regions", "environments", "categories"]
        );

        const expFilterData = dxCardService.transformNestedData(
            expFilterDataRaw,
            ["countries", "regions", "tagGroups", "tags"]
        );

        const restaurantFilterData = dxCardService.transformNestedData(
            resFilterDataRaw,
            ["countries", "regions"]
        );

        return {
            dxStays: {
                values: staysParsed,
                filterData: stayFilterData,
            },
            dxExperiences: {
                values: expsParsed,
                filterData: expFilterData,
            },
            dxRestaurants: {
                values: restaurantsParsed,
                filterData: restaurantFilterData,
            },
        };
    },

    transformFilterData(data, keyLabels) {
        const result = {};
        const sets = keyLabels.map(() => new Set());

        function traverse(obj, level = 0) {
            if (level >= keyLabels.length) return;

            if (Array.isArray(obj)) {
                obj.forEach(item => {
                    if (item !== "empty") {
                        sets[level].add(item);
                    }
                });
                return;
            }

            if (typeof obj !== 'object' || obj === null) return;

            for (const [key, value] of Object.entries(obj)) {
                if (key !== "empty") {
                    sets[level].add(key);
                }
                traverse(value, level + 1);
            }
        }

        traverse(data);

        keyLabels.forEach((label, index) => {
            result[label] = Array.from(sets[index]);
        });

        return result;
    }

}));
