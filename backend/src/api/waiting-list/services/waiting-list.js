'use strict';

/**
 * waiting-list service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::waiting-list.waiting-list');
