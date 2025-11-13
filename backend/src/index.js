"use strict";
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // strapi.db.lifecycles.subscribe({
    //   models: ["plugin::users-permissions.user"],

    //   // your lifecycle hooks

    // });

    // const bookmarks = await strapi.entityService.findMany(
    //   "api::bookmark.bookmark",{
    //     populate:["user","postcard"]
    //   }
    // );
    // console.log(bookmarks)
    // for (let i=0 ;i< bookmarks.length;i++){
    //   let bm = bookmarks[i];
    //   bm.postcard = bm.postcard?.id;
    //   bm.user = bm.user?.id
    //   if(!bm.postcard || !bm.user) continue;
    // const postcard = await strapi.entityService.findOne(
    //   "api::postcard.postcard",
    //   bm.postcard,
    //   {
    //     populate: ["album"]

    //   }
    // );

    // if (postcard?.album?.id) {
    //   const entry = await strapi.db
    //     .query("api::follow-album.follow-album")
    //     .findMany({
    //       where: { follower: bm.user, album: postcard.album.id },
    //     });
    //   if (entry.length == 0) {
    //     await strapi.entityService.create("api::follow-album.follow-album", {
    //       data: {
    //         follower: bm.user,
    //         album: postcard.album.id,
    //       },
    //     });
    //   }
    // }

    // if (postcard?.album?.company?.affiliations) {
    //   for(let j=0;j<postcard.album.company.affiliations.length; j++){
    //     let aff=  postcard.album.company.affiliations[j];

    //     const entry = await strapi.db
    //       .query("api::follow-affiliate.follow-affiliate")
    //       .findMany({
    //         where: { follower: bm.user, affiliation: aff.id },
    //       });

    //     if (entry.length == 0) {
    //       await strapi.entityService.create("api::follow-affiliate.follow-affiliate", {
    //         data: {
    //           follower: bm.user,
    //           affiliation: aff.id,
    //         },
    //       });
    //     }
    //   }
    // }
    // }

    try {

      strapi.service('api::album.album').cacheAlbums();
      strapi.service('api::album.album').cacheAlbumFilter();
      strapi.service('api::dx-card.dx-card').cacheDxCards();
      strapi.service('api::postcard.postcard').clearPostcardsCache();
      strapi.service('api::postcard.postcard').cachePostcards();

    } catch (error) {
      console.log("[bootstrap]", error);
    }
  },
};
