'use strict';

/**
 * content-review service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::content-review.content-review');
