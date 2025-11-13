'use strict';

/**
 *  contact-us controller
 */
 const emailnotification = require("../../../utils/emailnotification");

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact-us.contact-us',
({ strapi }) => ({
  

    async create(ctx) {
        // some logic here

        const { data } = ctx.request.body;
      
        if(data.album){
                let albumData = await strapi.db
                .query("api::album.album")
                .findOne({
                where: { id: data.album}
                });
                data.albumName = albumData?.name  || "NA";
                data.albumLink = "https://postcard.travel/"+ albumData?.slug ;
        }
        else{
            data.albumName =  "NA";
            data.albumLink = "NA" ;
        }
        console.log("data",data);
        emailnotification.send("contactus", data);
    
        const response = await super.create(ctx);
        // some more logic
      
        return response;

      }
  })
);
