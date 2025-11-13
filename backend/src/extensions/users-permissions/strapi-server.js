const axios = require("axios");
const _ = require("lodash");
const { registerUser, createSessionRecord } = require("./_services");

const { emailRegExp } = require("./_constants");
const { sanitizeUser, formatError, generateReferralCode } = require("./_utils");
const emailnotification = require("../../utils/emailnotification");

module.exports = (plugin) => {
  // OVERRIDEN CONTROLLERS

  (plugin.controllers.user["me"] = async (ctx) => {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized();
    }
    const fullUser = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: { id: user.id },
        populate: [
          "profilePic",
          "profilePicURL",
          "coverImage",
          "user_type",
          "sharedSeo",
          "albums",
          "social",
          "lead.article",
          "lead_hotel",
          "lead_tour",
          "company",
          "profile",

        ],
      });
    ctx.body = await sanitizeUser(fullUser, ctx);
  }),
    (plugin.controllers.user["update"] = async (ctx) => {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }
      const { data } = ctx.request.body;

      if (ctx.params?.id == user.id) {
        const updatedUser = await strapi.entityService.update(
          "plugin::users-permissions.user",
          ctx.state.user?.id,
          {
            data: data,
          }
        );

        const fullUser = await strapi.db
          .query("plugin::users-permissions.user")
          .findOne({
            where: { id: updatedUser.id },
            populate: [
              "profilePic",
              "profilePicURL",
              "coverImage",
              "user_type",
              "sharedSeo",
              "company",
              "profile",
            ],
          });
        return (ctx.body = await sanitizeUser(fullUser, ctx));
      } else {
        //invalid user
        return ctx.badRequest(
          null,
          formatError({
            id: "error",
            message: "User not matching",
          })
        );
      }
    }),
    (plugin.controllers.user["find"] = async (ctx) => {
      const users = await strapi
        .query("plugin::users-permissions.user")
        .findMany({
          where: ctx.query.filters,
          select: [
            "fullName",
            "slug",
            "profilePicURL",
            "priority",
            "bio",
            "city",
            "firstName",
            "lastName",
          ],
          populate: {
            profilePic: true,
            coverImage: {
              select: ["id","url"],
            },
            user_type: true,
            seo: true,
            country: true,
            albums: true,
            social: true,
            company: {
              populate: { icon: true },
            },
            lead: {
              select: [
                "fullName",
                "bio",
                "editorialFee",
                "slug",
                "accessCode",
                "status",
                "priority",
              ],
              populate: {
                profilePic: {
                  select: ["url"],
                },
                article: true,
                country: true,
              },
              lead_hotel: true,
              lead_tour: true,
              profile: true,
            },
            postcards: {
              select: ["id"],
              populate: {
                bookmarks: {
                  populate: {
                    user: {
                      select: ["id"],
                    },
                  },
                },
              },
            },
            bookmarks: {
              populate: {
                postcard: {
                  select: ["id"],
                  populate: { country: true },
                },
              },
            },
            follow_companies: {
              populate: {
                company: true,
              },
            },
          },
        });

      const formattedUsers = users.map((user) => {
        const bookmarkedCount = user.bookmarks.length;
        const bookmarkedCountries = new Set();

        for (const bookmark of user.bookmarks) {
          if (bookmark?.postcard?.country?.name)
            bookmarkedCountries.add(bookmark.postcard.country.name);
        }
        delete user.bookmarks;
        user.bookmarkedCount = bookmarkedCount;
        user.bookmarkedCountries = bookmarkedCountries.size;
        user.postcardsCreated = user.postcards?.length || 0;
        user.uniqueCollectors = 0;
        if (user.postcardsCreated > 0) {
          let followers = [];
          user.postcards.map((pc) => {
            pc.bookmarks?.map((bm) => {
              if (!followers.includes(bm.user?.id)) followers.push(bm.user?.id);
            });
          });
          user.uniqueCollectors = followers.length;
        }
        delete user.postcards;
      });
      ctx.body = await Promise.all(
        users.map((user) => sanitizeUser(user, ctx))
      );
    });

  plugin.controllers.user["getlist"] = async (ctx) => {
    const users = await strapi
      .query("plugin::users-permissions.user")
      .findMany({
        where: ctx.query.filters,
        select: ["fullName", "slug", "email", "bio", "createdAt"],
        orderBy: ctx.query.sort,
        limit: ctx.query.limit,
        populate: {
          albums: {
            populate: {
              on_boarding: true,
            },
          },
          profilePic: true,
          company: true,
          postcards: true,
          user_type: true,
          postcards: {
            select: ["id"],
            populate: {
              bookmarks: {
                populate: {
                  user: {
                    select: ["id"],
                  },
                },
              },
            },
          },
          bookmarks: {
            populate: {
              postcard: {
                select: ["id"],
                populate: { country: true },
              },
            },
          },
        },
      });

    const formattedUsers = users.map((user) => {
      const bookmarkedCount = user.bookmarks.length;
      const bookmarkedCountries = new Set();

      for (const bookmark of user.bookmarks) {
        if (bookmark?.postcard?.country?.name)
          bookmarkedCountries.add(bookmark.postcard.country.name);
      }
      delete user.bookmarks;
      user.bookmarkedCount = bookmarkedCount;
      user.bookmarkedCountries = bookmarkedCountries.size;
      user.postcardsCreated = user.postcards?.length || 0;
      user.uniqueCollectors = 0;
      if (user.postcardsCreated > 0) {
        let followers = [];
        user.postcards.map((pc) => {
          pc.bookmarks?.map((bm) => {
            if (!followers.includes(bm.user?.id)) followers.push(bm.user?.id);
          });
        });
        user.uniqueCollectors = followers.length;
      }
      delete user.postcards;
    });

    ctx.body = await Promise.all(users.map((user) => sanitizeUser(user, ctx)));
  };

  plugin.controllers.user["findOne"] = async (ctx) => {
    const user = await strapi.query("plugin::users-permissions.user").findMany({
      where: { id: ctx.params?.id },
      select: ["fullName", "slug","profilePicURL", "priority", "bio"],
      populate: {
        profilePic: true,
        coverImage: {
          select: ["id","url"],
        },
        user_type: true,
        seo: true,
        country: true,
        albums: true,
        social: true,
        company: {
          populate: { icon: true },
        },
        lead: {
          select: [
            "fullName",
            "bio",
            "editorialFee",
            "slug",
            "accessCode",
            "status",
            "priority",
          ],
          populate: {
            profilePic: {
              select: ["url"],
            },
            article: true,
            country: true,
            follow_companies: {
              populate: {
                company: true,
              },
            },
          },
          lead_hotel: true,
          lead_tour: true,
          profile: true,
        },
      },
    });
    ctx.body = await sanitizeUser(user, ctx);
  };

  plugin.controllers.auth["callback"] = async (ctx) => {
    const provider = ctx.params.provider || "local";
    const params = ctx.request.body;

    const store = await strapi.store({
      environment: "",
      type: "plugin",
      name: "users-permissions",
    });

    if (provider === "local") {
      if (!_.get(await store.get({ key: "grant" }), "email.enabled")) {
        return ctx.badRequest(null, "This provider is disabled.");
      }

      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.email.provide",
            message: "Please provide your username or your e-mail.",
          })
        );
      }

      // The password is required.
      if (!params.password) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.password.provide",
            message: "Please provide your password.",
          })
        );
      }

      const query = {};

      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const users = await strapi.query("user", "users-permissions").findMany({
        where: query,
        populate: {
          profilePic: true,
          coverImage: true,
          user_type: true,
          sharedSeo: true,
        },
      });
      const user = users?.[0];

      if (!user) {
        // Create a new account if not exists
        try {
          const data = await registerUser(strapi, ctx);

          emailnotification.send("new-user-signup", {
            link: "https://postcard.travel/" + data?.user?.slug,
            userName: data?.user?.fullName,
            emailTo: "amit@postcard.travel,mike@postcard.travel,sanjay@tpix.in",
          });

          return ctx.send({ ...data });
        } catch (error) {
          console.log("error", error);

          return ctx.badRequest(
            null,
            formatError({
              id: "Auth.form.error.failed",
              message: "Create a new account failed",
            })
          );
        }
      }

      if (
        _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
        user.confirmed !== true
      ) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.confirmed",
            message: "Your account email is not confirmed",
          })
        );
      }

      if (user.blocked === true) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.blocked",
            message: "Your account has been blocked by an administrator",
          })
        );
      }

      // The user never authenticated with the `local` provider.
      if (!user.password) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.password.local",
            message:
              "This user never set a local password, please login with the provider used during account creation.",
          })
        );
      }

      const validPassword = strapi.plugins[
        "users-permissions"
      ].services.user.validatePassword(params.password, user.password);

      if (!validPassword) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.invalid",
            message: "Identifier or password invalid.",
          })
        );
      } else {
        const sanitizedUser = sanitizeUser(user, ctx);

        ctx.send({
          jwt: strapi.plugins["users-permissions"].services.jwt.issue({
            id: user.id,
          }),
          user: sanitizedUser,
        });
      }
    } else {
      if (!_.get(await store.get({ key: "grant" }), [provider, "enabled"])) {
        return ctx.badRequest(
          null,
          formatError({
            id: "provider.disabled",
            message: "This provider is disabled.",
          })
        );
      }

      // Connect the user with the third-party provider.

      let user, error;

      try {
        // [user, error] = await strapi.plugins[
        //   "users-permissions"
        // ].services.providers.connect(provider, ctx.query);

        user = await require("./services/providers")({
          strapi: strapi,
        }).connect(provider, ctx.query);
      } catch ([user, error]) {
        return ctx.badRequest(null, error === "array" ? error[0] : error);
      }

      if (!user) {
        return ctx.badRequest(null, error === "array" ? error[0] : error);
      }

      createSessionRecord(strapi, ctx, user);

      // new USER
      // const sanitizedUser = await sanitizeUser(user, ctx);

      // emailnotification.send("welcome",{user:user.username});

      // create a session

      const fullUser = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: user.id },
          populate: [
            "profilePic",
             "profilePicURL",
            "coverImage",
            "user_type",
            "sharedSeo",
            "company",
          ],
        });
      return ctx.send({
        jwt: strapi.plugins["users-permissions"].services.jwt.issue({
          id: user.id,
        }),
        user: fullUser,
      });
    }
  };

  plugin.controllers.user["tracking"] = async (ctx) => {
    const {
      utm_source,
      trackingCode,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    } = ctx.request.body;
    if (
      utm_source ||
      utm_medium ||
      trackingCode ||
      utm_term ||
      utm_content ||
      utm_campaign
    ) {
      if (!ctx.state.user?.utm_source?.length) {
        await strapi.entityService.update(
          "plugin::users-permissions.user",
          ctx.state.user?.id,
          {
            data: {
              tracking: {
                utm_source: utm_source,
                utm_medium: utm_medium,
                utm_campaign: utm_campaign,
                utm_term: utm_term,
                utm_content: utm_content,
              },
            },
          }
        );
        ctx.body = "utm_source updated";
      }
    } else {
      ctx.body = "missing tracking information";
    }
  };

  plugin.controllers.auth.refreshToken = async (ctx) => {
    const payload = await strapi.plugins["users-permissions"].services.jwt
      .verify(ctx.request.body.token)
      .catch((error) => {
        console.log(error.message);
        return {
          jwt: strapi.plugins["users-permissions"].services.jwt.issue({
            id: ctx.request.body.id,
          }),
        };
      });

    console.log(payload);
    return { jwt: payload.jwt };
  };

  plugin.controllers.user["getfollowerslist"] = async (ctx) => {
    let user = ctx.state.user;
    if(ctx.query?.user){
      user = { id: ctx.query.user}
    }
    console.log(user);
    if (!user) {
      return ctx.unauthorized();
    }
    const fullUser = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: { id: user.id },
        select: ["id"],
        populate: {
          follows: {
            populate: {
              following: true,
            },
          },
          follow_albums: {
            populate: {
              album: true,
            },
          },
          follow_companies: {
            populate: {
              company: true,
            },
          },
          follow_affiliates: {
            populate: {
              affiliation: true,
            },
          },
        },
      });

      ctx.body = await sanitizeUser(fullUser, ctx);
    };

  // OVERRIDEN ROUTES

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/users/me",
    handler: "user.me",
    config: {
      policies: [],
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/users/:id",
    handler: "user.update",
    config: {
      policies: [],
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/users",
    handler: "user.find",
    config: {
      policies: [],
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/userslist8775",
    handler: "user.getlist",
    config: {
      policies: [],
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/local",
    handler: "auth.callback",
    config: {
      middlewares: ["plugin::users-permissions.rateLimit"],
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/auth/:provider/callback",
    handler: "auth.callback",
    config: {
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/sourcetracking",
    handler: "user.tracking",
    config: {
      middlewares: ["plugin::users-permissions.rateLimit"],
      prefix: "",
    },
  });
  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/refreshToken",
    handler: "auth.refreshToken",
    config: {
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/followerslist",
    handler: "user.getfollowerslist",
    config: {
      policies: [],
      prefix: "",
    },
  });

  return plugin;
};
