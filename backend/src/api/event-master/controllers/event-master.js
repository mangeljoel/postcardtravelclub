'use strict';

/**
 * event-master controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event-master.event-master');
