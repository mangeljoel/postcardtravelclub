const { sanitize } = require("@strapi/utils");

const sanitizeUser = async (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

const getService = (strapi, name) => {
  return strapi.plugin("users-permissions").service(name);
};

const formatError = (error) => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

const randomString = (length, chars) => {
  let result = "";

  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

const generateReferralCode = (prefix) => {
  const randomPart = randomString(4, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");

  return `${prefix.toUpperCase()}${randomPart}`;
};

module.exports = {
  sanitizeUser,
  getService,
  formatError,
  generateReferralCode,
};
