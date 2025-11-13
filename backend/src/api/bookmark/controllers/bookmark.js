"use strict";

/**
 * bookmark controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::bookmark.bookmark",
  ({ strapi }) => ({
    async create(ctx) {
      let response = {};
      // some logic here
      try{
      const { data } = ctx.request.body;
      // create new bookdmark
      console.log("data", data);

      const entry = await strapi.db.query("api::bookmark.bookmark").findMany({
        where: {
          $and: [{ user: data.user }, { postcard: data.postcard }],
        },
      });
      console.log("entry", entry);

      if (entry.length == 0) {

        response = await super.create(ctx);
      }

      const postcard = await strapi.entityService.findOne(
        "api::postcard.postcard",
        data.postcard,
        {
          populate: {
            album: {
              populate: {
                company: {
                  populate: ["affiliations"],
                },
              },
            },
          },
        }
      );

      // if (postcard?.album?.id) {
      //   const entry = await strapi.db
      //     .query("api::follow-album.follow-album")
      //     .findMany({
      //       where: { follower: data.user, album: postcard.album.id },
      //     });
      //   if (entry.length == 0) {
      //     await strapi.entityService.create("api::follow-album.follow-album", {
      //       data: {
      //         follower: data.user,
      //         album: postcard.album.id,
      //       },
      //     });
      //   }
      // }

      if (postcard?.album?.company?.id) {
        const entry = await strapi.db
          .query("api::follow-company.follow-company")
          .findMany({
            where: { follower: data.user, company: postcard.album.company.id },
          });
        if (entry.length == 0) {
          strapi.entityService.create("api::follow-company.follow-company", {
            data: {
              follower: data.user,
              company: postcard.album.company.id,
            },
          });
        }
      }



      if (postcard?.album?.company?.affiliations) {
        postcard.album.company.affiliations.map(async (aff) => {
          const entry = await strapi.db
            .query("api::follow-affiliate.follow-affiliate")
            .findMany({
              where: { follower: data.user, affiliation: aff.id },
            });

          if (entry.length == 0) {
            strapi.entityService.create("api::follow-affiliate.follow-affiliate", {
              data: {
                follower: data.user,
                affiliation: aff.id,
              },
            });
          }
        });
      }
      return (ctx.body = response);
    }
    catch(err){
        console.log(err)
        return err
    }
    },
  })
);
