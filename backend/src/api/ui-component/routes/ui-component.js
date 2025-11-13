'use strict';

/**
 * ui-component router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::ui-component.ui-component');
