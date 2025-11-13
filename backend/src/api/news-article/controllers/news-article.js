"use strict";
const emailnotification = require("../../../utils/emailnotification");

/**
 *  news-article controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::news-article.news-article",
  ({ strapi }) => ({
    async submitForApproval(ctx) {
      if (!ctx.query.articleId)
        return (ctx.body = { error: "invalid request" });

      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      let article = await strapi.db
        .query("api::news-article.news-article")
        .findOne({
          where: { album: ctx.query.articleId },
          populate: { creator: true, block: true },
        });

        strapi.service("api::activity-log.activity-log").create({
            data: {
              activty: "ArticleSubmit",
              user: user.id,
              news_article:article.id,
              detail: "Article Submitted for Review"
            }
          });

        emailnotification.send("article-review", {
            link:
              "https://postcard.travel/wanderlust" +
              article.id,
            user: article.creator?.fullName,
            name: article.title
          });

          return entry;
    },

    async reject(ctx) {
        if (!ctx.query.articleId)
          return (ctx.body = { error: "invalid request" });

        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized();
        }

        let article = await strapi.db
          .query("api::article-reject")
          .findOne({
            where: { album: ctx.query.articleId },
            populate: { creator: true, block: true },
          });

          strapi.service("api::activity-log.activity-log").create({
            data: {
              activty: "ArticleReject",
              user: user.id,
              news_article:article.id,
              detail: "Article Rejected - " + ctx.query.reason
            }
          });

          emailnotification.send("postcard-stories-review", {
              link:
                "https://postcard.travel/wanderlust" +
                article.id,
              user: article.creator?.fullName,
              name: article.title,
              reason: ctx.query.reason
            });

            return entry;
      },

      async approve(ctx) {
        if (!ctx.query.articleId)
          return (ctx.body = { error: "invalid request" });

        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized();
        }

        let article = await strapi.db
          .query("api::news-article.news-article")
          .findOne({
            where: { album: ctx.query.articleId },
            populate: { creator: true, block: true },
          });


          strapi.service("api::activity-log.activity-log").create({
            data: {
              activty: "ArticleApprove",
              user: user.id,
              news_article:article.id,
              detail: "Article Approved"
            }
          });

          emailnotification.send("article-approve", {
              link:
                "https://postcard.travel/wanderlust" +
                article.id,
              user: article.creator?.fullName,
              name: article.title
            });

            return entry;
    },
    async publish(ctx) {
        // if (!ctx.query.articleId)
        //   return (ctx.body = { error: "invalid request" });

        // const user = ctx.state.user;
        // if (!user) {
        //   return ctx.unauthorized();
        //  }
       let article = await strapi.db
          .query("api::news-article.news-article")
          .findOne({
            where: { id: ctx.query.articleId },
            populate: { creator: true, block: true },
          });
await strapi.service("api::activity-log.activity-log").create({
            data: {
              activty: "ArticlePublish",
              user: article?.creator?.id??null,
              news_article:article.id,
              detail: "Article Published"
            }
          });

         await emailnotification.send("article-publish", {
              link:
                "https://postcard.travel/wanderlust/" +
                article.id,
              user: article.creator?.fullName,
            name: article.title,
              emailTo:"escutchfield@postcard.travel,karen.hastings@postcard.travel"
            });

      return {
        link:
          "https://postcard.travel/wanderlust/" +
          article.id,
        user: article.creator?.fullName,
        name: article.title,
        emailTo: "angel@tpix.in"
      };
      },
  })
);
