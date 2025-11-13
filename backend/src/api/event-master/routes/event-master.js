'use strict';

/**
 * event-master router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::event-master.event-master');
