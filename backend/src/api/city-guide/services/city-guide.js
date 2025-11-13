'use strict';

/**
 * city-guide service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::city-guide.city-guide');
