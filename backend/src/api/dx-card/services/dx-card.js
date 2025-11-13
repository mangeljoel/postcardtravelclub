'use strict';
const redis = require("../../../utils/redis");
const redisClient = require("../../../utils/redis");
/**
 * dx-card service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dx-card.dx-card', ({ strapi }) => ({
    async cacheDxCards() {
        try {
            await redisClient.connect();
            const redisConn = redisClient.getConnection();

            const pattern = 'dxcard:*';
            let cursor = '0';

            do {
                const scanResult = await redisConn.sendCommand([
                    'SCAN',
                    cursor,
                    'MATCH',
                    pattern,
                    'COUNT',
                    '1000',
                ]);

                // scanResult is an array like: [cursor, [keys...]]
                const [nextCursor, keyArray] = scanResult;
                cursor = nextCursor;

                if (keyArray.length) {
                    await redisConn.unlink(...keyArray);
                    console.log(`Deleted ${keyArray.length} dxcard keys`);
                }
            } while (cursor !== '0');

            console.log('All dxcard:* keys deleted.');

            await this.createDxCardIndex(redisConn)

            const dxcards = await strapi.db.query("api::dx-card.dx-card").findMany({
                select: ["id", "name", "intro", "story"],
                where: {
                    destination_expert: {
                        status: "published",
                    }
                },
                populate: {
                    destination_expert: { select: ["id"] },
                    dx_card_type: { select: ["id", "name"] },
                    coverImage: { select: ["id", "url"] },
                    country: { select: ["id", "name"] },
                    region: { select: ["id", "name"] },
                    environment: { select: ["id", "name"] },
                    category: { select: ["id", "name"] },
                    tags: { select: ["id", "name"] },
                    tag_group: { select: ["id", "name"] },
                    postcard: { select: ["id", "name"] },
                    album: { select: ["id", "name"] },
                },
            })

            for (const card of dxcards) {
                await redisConn.json.set(`dxcard:${card.id}`, '$', card);
            }
        } catch (err) {
            console.error("Error: ", err);
        }
    },

    async createDxCardIndex(redisConn) {
        try {
            await redisConn.sendCommand(['FT.CREATE', 'idx:dxcard',
                'ON', 'JSON',
                'PREFIX', '1', 'dxcard:',
                'SCHEMA',
                '$.id', 'AS', 'id', 'NUMERIC',
                '$.dx_card_type.id', 'AS', 'dx_card_type_id', 'NUMERIC',
                '$.destination_expert.id', 'AS', 'expert_id', 'NUMERIC',
            ]);

            console.log('✅ RediSearch index "idx:dxcard" created successfully');
        } catch (err) {
            if (err.message.includes('Index already exists')) {
                console.log('ℹ️ RediSearch index "idx:dxcard" already exists');
            } else {
                console.error('❌ Failed to create RediSearch index:', err);
            }
        }
    },

    async refreshExpertDxCardsInCache(expertId) {
        await redisClient.connect();
        const redisConn = redisClient.getConnection();

        const indexName = 'idx:dxcard';

        // Delete old keys
        const result = await redisConn.sendCommand([
            'FT.SEARCH',
            indexName,
            `@expert_id:[${expertId} ${expertId}]`,
            'RETURN',
            '0'
        ]);

        const oldKeys = result.slice(1); // every odd entry is a key

        if (oldKeys.length) {
            await redisConn.unlink(...oldKeys);
            console.log(`Deleted ${oldKeys.length} keys for expert ${expertId}`);
        }

        // Re-cache new cards
        const dxcards = await strapi.db.query("api::dx-card.dx-card").findMany({
            select: ["id", "name", "intro", "story"],
            where: { destination_expert: expertId },
            populate: {
                destination_expert: { select: ["id"] },
                dx_card_type: { select: ["id", "name"] },
                coverImage: { select: ["id", "url"] },
                country: { select: ["id", "name"] },
                region: { select: ["id", "name"] },
                environment: { select: ["id", "name"] },
                category: { select: ["id", "name"] },
                tags: { select: ["id", "name"] },
                tag_group: { select: ["id", "name"] },
                postcard: { select: ["id", "name"] },
                album: { select: ["id", "name"] },
            },
        });

        for (const card of dxcards) {
            await redisConn.json.set(`dxcard:${card.id}`, '$', card);
        }

        console.log(`Re-cached ${dxcards.length} cards for expert ${expertId}`);

        return dxcards;
    },

    // async prepareJsonForRedis(records, hierarchyKeys = [], isLastKeyList = false) {
    //     function deepSearchByKey(obj, key) {
    //         const results = [];
    //         function recurse(curr) {
    //             if (typeof curr !== 'object' || curr === null) return;
    //             if (curr.hasOwnProperty(key)) {
    //                 results.push(curr[key]);
    //             }
    //             for (const val of Object.values(curr)) {
    //                 recurse(val);
    //             }
    //         }
    //         recurse(obj);
    //         return results;
    //     }

    //     const root = {};

    //     for (const record of records) {
    //         let current = root;

    //         for (let i = 0; i < hierarchyKeys.length; i++) {
    //             const key = hierarchyKeys[i];
    //             const allMatches = deepSearchByKey(record, key);
    //             let value = allMatches.length ? allMatches[0] : undefined;
    //             const isLast = i === hierarchyKeys.length - 1;

    //             // If no match found, mark as "empty"
    //             if (value === undefined || value === null) {
    //                 value = "empty";
    //             }

    //             if (isLast) {
    //                 const items = isLastKeyList
    //                     ? (Array.isArray(value) ? value : [value])
    //                     : [value];

    //                 const itemNames = items.map(item => {
    //                     if (typeof item === 'object') {
    //                         return item?.name || "empty";
    //                     }
    //                     return item || "empty";
    //                 }).filter(Boolean);

    //                 if (!current.__items) current.__items = new Set();
    //                 for (const name of itemNames) {
    //                     current.__items.add(name);
    //                 }
    //             } else {
    //                 const keyName = typeof value === 'object' ? value?.name || "empty" : value || "empty";
    //                 if (!current[keyName]) {
    //                     current[keyName] = {};
    //                 }
    //                 current = current[keyName];
    //             }
    //         }
    //     }

    //     function clean(obj) {
    //         if (obj instanceof Set) return Array.from(obj);
    //         if (Array.isArray(obj)) return obj;

    //         const result = {};
    //         for (const key in obj) {
    //             if (key === '__items') {
    //                 return Array.from(obj[key]);
    //             }
    //             result[key] = clean(obj[key]);
    //         }
    //         return result;
    //     }

    //     const finalResult = clean(root);
    //     // console.log("Final Result:", finalResult);
    //     return finalResult;
    // },

    async prepareJsonForRedis(records, hierarchyKeys = [], isLastKeyList = false) {
        function deepSearchByKey(obj, key) {
            const results = [];
            function recurse(curr) {
                if (typeof curr !== 'object' || curr === null) return;
                if (curr.hasOwnProperty(key)) {
                    results.push(curr[key]);
                }
                for (const val of Object.values(curr)) {
                    recurse(val);
                }
            }
            recurse(obj);
            return results;
        }

        const root = {};

        function insertIntoTree(current, valueGroups, items) {
            const [currentValues, ...rest] = valueGroups;

            for (const val of currentValues) {
                const keyName = typeof val === 'object' ? val?.name || "empty" : val || "empty";
                if (!current[keyName]) current[keyName] = {};

                if (rest.length === 0) {
                    if (!current[keyName].__items) current[keyName].__items = new Set();
                    for (const item of items) {
                        current[keyName].__items.add(item);
                    }
                } else {
                    insertIntoTree(current[keyName], rest, items);
                }
            }
        }

        for (const record of records) {
            const valueGroups = [];

            for (let i = 0; i < hierarchyKeys.length; i++) {
                const key = hierarchyKeys[i];
                let matches = deepSearchByKey(record, key);
                if (!matches.length) matches = ["empty"];

                const isLast = i === hierarchyKeys.length - 1;

                if (isLast) {
                    let items = isLastKeyList
                        ? matches.flatMap(val => (Array.isArray(val) ? val : [val]))
                        : matches;

                    const itemNames = items.map(item =>
                        typeof item === 'object' ? item?.name || "empty" : item || "empty"
                    ).filter(Boolean);

                    valueGroups.push(itemNames);
                } else {
                    valueGroups.push(matches);
                }
            }

            insertIntoTree(root, valueGroups.slice(0, -1), valueGroups.at(-1));
        }

        function clean(obj) {
            if (obj instanceof Set) return Array.from(obj);
            if (Array.isArray(obj)) return obj;

            const result = {};
            for (const key in obj) {
                if (key === '__items') {
                    return Array.from(obj[key]);
                }
                result[key] = clean(obj[key]);
            }
            return result;
        }

        return clean(root);
    },

    transformNestedData(input, levels) {
        const output = {};

        // Initialize all levels, including last one as array
        levels.forEach((level, i) => {
            output[level] = i === levels.length - 1 ? [] : {};
        });

        function traverse(node, path = []) {
            const depth = path.length;

            if (depth === levels.length - 1) {
                const values = node; // e.g., ["Villas", "Eco-Lodge"]
                const leafLevelKey = levels[depth];

                // Fill leaf level (e.g., "tags")
                values.forEach(value => {
                    if (!output[leafLevelKey].includes(value)) {
                        output[leafLevelKey].push(value);
                    }
                });

                // Build nested maps from parent to current level
                for (let i = depth - 1; i >= 0; i--) {
                    const currentKey = levels[i];
                    const currentPathKey = path[i];

                    if (i === depth - 1) {
                        if (!output[currentKey][currentPathKey]) {
                            output[currentKey][currentPathKey] = [];
                        }
                        values.forEach(value => {
                            if (!output[currentKey][currentPathKey].includes(value)) {
                                output[currentKey][currentPathKey].push(value);
                            }
                        });
                    } else {
                        const childKey = levels[i + 1];
                        const childPathKey = path[i + 1];

                        if (!output[currentKey][currentPathKey]) {
                            output[currentKey][currentPathKey] = {};
                        }

                        if (!output[currentKey][currentPathKey][childPathKey]) {
                            output[currentKey][currentPathKey][childPathKey] = Array.isArray(output[childKey][childPathKey])
                                ? [...output[childKey][childPathKey]]
                                : { ...output[childKey][childPathKey] };
                        }
                    }
                }

                return;
            }

            for (const key in node) {
                traverse(node[key], [...path, key]);
            }
        }

        traverse(input);
        return output;
    },

}));
