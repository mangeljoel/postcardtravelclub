'use strict';

/**
 * destination-expert controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::destination-expert.destination-expert', ({ strapi }) => ({
    async getExpertData(ctx) {
        const { dxId } = ctx.params;
        const cache = ctx.query.cache === 'true';
        const filter = ctx.query.filter === 'true';

        if (!dxId) {
            return ctx.badRequest("Missing expertId in query.");
        }

        let dxcards = [];

        if (cache) {
            dxcards = await strapi.service('api::dx-card.dx-card').refreshExpertDxCardsInCache(dxId);
        }

        if (filter || !cache) {
            const filtered = await strapi.service('api::destination-expert.destination-expert').buildFilteredDxData(dxId, dxcards);
            return filtered;
        }
        // const data = await strapi.service('api::destination-expert.destination-expert').extractFilters(Number(dxId));
        return { message: "Cache refreshed but filter not requested." };
    },
}));
