'use strict';

/**
 *  config controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::config.config',
({ strapi }) => ({
  async counters(ctx) {
    const postcardCount = await strapi.db.query('api::postcard.postcard').count({
        where: {
            isComplete: true
        },
      });

    const albums = await strapi.db.query('api::album.album').findMany({
        where: {
            isFeatured:true
        },
        populate:["country"]
    });

    let countries = [];
    albums.map(album => {
        if(countries.indexOf(album.country?.id) === -1 && album.country?.id !== undefined) 
            countries.push(album.country?.id);
        });

        console.log(countries);
    return ctx.send({
        postcardCount: postcardCount,
        countries: countries.length
    });
      
  }
})
);

