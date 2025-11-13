'use strict';

/**
 * event-master service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::event-master.event-master');
