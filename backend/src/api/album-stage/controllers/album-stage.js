"use strict";

const emailnotification = require("../../../utils/emailnotification");

/**
 *  album-stage controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::album-stage.album-stage",
  ({ strapi }) => ({
    async verifyKey(ctx) {
      if (!ctx.query.key || ctx.query.key.length < 3)
        return (ctx.body = { error: "invalid key" });

      let stages = await strapi.db
        .query("api::album-stage.album-stage")
        .findMany({
          where: { key: ctx.query.key, state: "tour-meta-story" },
          populate: ["user", "album"],
        });

      if (stages?.length > 0) {
        // `
        if (stages[0].user) {
          // already associated error
          return (ctx.body = {
            error: "Tour is already associated with an user",
          });
        }
        const entry = await strapi.entityService.update(
          "api::album-stage.album-stage",
          stages[0].id,
          {
            data: {
              user: ctx.query.profile,
              state: "postcard-titles-upload",
            },
          }
        );
        if (stages[0].album) {
          const storyEntry = await strapi.entityService.update(
            "api::album.album",
            stages[0].album.id,
            {
              data: {
                user: ctx.query.profile,
              },
            }
          );
        }

        return entry;
      } else {
        return (ctx.body = { error: "No tour found to be linked" });
      }
    },

    async submitimagesforreview(ctx) {
      if (!ctx.query.albumId) return (ctx.body = { error: "invalid request" });

      let stage = await strapi.db
        .query("api::album-stage.album-stage")
        .findOne({
          where: { album: ctx.query.albumId, state: "postcard-titles-upload" },
          populate: { user: true, album: true },
        });

      if (!stage) return (ctx.body = { error: "Submission not valid" });

      const entry = await strapi.db
        .query("api::album-stage.album-stage")
        .update({
          where: { id: stage.id },
          data: {
            state: "postcard-titles-review",
          },
        });

      emailnotification.send("postcard-titles-review", {
        link:
        "https://postcard.travel/" +
        stage.album.slug,
        user: stage.user?.fullName,
        name: stage.album?.name,
      });

      return entry;
    },
    async submitcontentforreview(ctx) {
      if (!ctx.query.albumId) return (ctx.body = { error: "invalid request" });

      let stage = await strapi.db
        .query("api::album-stage.album-stage")
        .findOne({
          where: { album: ctx.query.albumId, state: "postcard-stories-upload" },
          populate: { user: true, album: true },
        });

      if (!stage) return (ctx.body = { error: "Submission not valid" });

      const entry = await strapi.db
        .query("api::album-stage.album-stage")
        .update({
          where: { id: stage.id },
          data: {
            state: "postcard-stories-review",
          },
        });

      emailnotification.send("postcard-stories-review", {
        link:
          "https://postcard.travel/" +
          stage.album.slug,
        user: stage.user?.fullName,
        name: stage.album?.name,
      });

      return entry;
    },
  })
);
