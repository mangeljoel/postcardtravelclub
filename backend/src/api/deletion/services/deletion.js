'use strict';

/**
 * deletion service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::deletion.deletion');
