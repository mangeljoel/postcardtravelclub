// https://docs.strapi.io/developer-docs/latest/development/backend-customization/routes.html#public-routes

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/webhooks/typeform",
      handler: "webhooks.index",
      config: {
        auth: false,
      },
    },
  ],
};
