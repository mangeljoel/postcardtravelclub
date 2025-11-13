const _ = require("lodash");
const utils = require("@strapi/utils");
const { yup, validateYupSchema } = utils;
const { ApplicationError, ValidationError } = utils.errors;
const { emailRegExp } = require("../_constants");
const { sanitizeUser, getService, generateReferralCode } = require("../_utils");

const registerBodySchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const validateRegisterBody = validateYupSchema(registerBodySchema);

const createReferralCode = async (strapi, ctx, user, code) => {
  const referralCode = ctx?.request?.query?.referral_code;
  let referenceUser;

  if (referralCode) {
    referenceUser = await strapi.db
      .query("api::referral-code.referral-code")
      .findOne("api::referral-code.referral-code", {
        where: {
          code: referralCode,
        },
      });
  }

  const resp = await strapi.entityService.create(
    "api::referral-code.referral-code",
    {
      data: {
        user: user.id,
        reference_user: referenceUser?.id,
        code,
      },
    }
  );

  return resp;
};

const createReferralHistory = async (strapi, ctx, user) => {
  const referralCode = ctx?.request?.query?.referral_code;

  if (referralCode) {
    const userResp = await strapi.db
      .query("api::referral-code.referral-code")
      .findOne("api::referral-code.referral-code", {
        where: {
          code: referralCode,
        },
      });

    // Add bonus money
    // await redisClient.connect();

    // const appConfig = await redisClient.getValue(REDIS_KEYS.APP_CONFIG);
    // let currencies = await redisClient.getValue(REDIS_KEYS.CURRENCY);

    // if (!currencies) {
    //   console.log("Error: No currencies in redis");
    //   return;
    // }

    // const bonusCurrency = currencies.filter((curr) => curr.type === "bonus");
    // const walletResp = await strapi.db.query("api::wallet.wallet").findOne({
    //   where: {
    //     currency: bonusCurrency[0].id,
    //     user: user.id,
    //   },
    // });
    // const updatedWalletResp = await strapi.entityService.update(
    //   "api::wallet.wallet",
    //   walletResp.id,
    //   {
    //     data: Number(walletResp.balance) + appConfig?.referralBonusAmount,
    //   }
    // );

    // Create referral history
    const resp = await strapi.entityService.create(
      "api::referral-history.referral-history",
      {
        data: {
          source_user: userResp.id,
          referred_user: user.id,
        },
      }
    );

    return resp;
  }

  return null;
};


const createSessionRecord = async (strapi,  ctx, user) => {
  // await redisClient.connect();
  // console.log("ip",ctx.request.ip);
  // console.log("request",ctx.request);

  let userDevice = await strapi.db.query("api::userdevice.userdevice")
  .findOne({
    where: {user: user.id,
    userAgent: ctx.request.header['user-agent'],
    os: ctx.request.header['sec-ch-ua-platform']
  }
  });
  if(!userDevice){
    userDevice = await strapi.db.query("api::userdevice.userdevice")
  .create({
    data:{
      user: user.id,
      userAgent: ctx.request.header['user-agent'],
      os: ctx.request.header['sec-ch-ua-platform'],
      isMobile: ctx.request.header['sec-ch-ua-mobile'] == "?1" ? true  : false
    }
  });
  }
  strapi.service("api::session.session").create({
    data: {
      ipAddress: ctx.request.header['x-real-ip'],
      user: user.id,
      userdevice: userDevice.id,
      url:ctx.request.url,
      ipCountry: ctx.request.header['cf-ipcountry'],
      referrer: ctx.request.header['referer']
    }
  });
};

const registerUser = async (strapi, ctx) => {
  const pluginStore = await strapi.store({
    type: "plugin",
    name: "users-permissions",
  });

  const settings = await pluginStore.get({
    key: "advanced",
  });

  if (!settings.allow_register) {
    throw new ApplicationError("Register action is currently disabled");
  }

  const params = {
    ..._.omit(ctx.request.body, [
      "identifier",
      "confirmed",
      "confirmationToken",
      "resetPasswordToken",
    ]),
    email: ctx?.request?.body?.identifier,
    username: ctx?.request?.body?.identifier?.toLowerCase().split("@")[0],
    provider: "local",
  };

  await validateRegisterBody(params);

  // Throw an error if the password selected by the user
  // contains more than three times the symbol '$'.
  if (getService(strapi, "user").isHashed(params.password)) {
    throw new ValidationError(
      "Your password cannot contain more than three times the symbol `$`"
    );
  }

  const role = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: settings.default_role } });

  if (!role) {
    throw new ApplicationError("Impossible to find the default role");
  }

  // Check if the provided email is valid or not.
  const isEmail = emailRegExp.test(params.email);

  if (isEmail) {
    params.email = params.email.toLowerCase();
  } else {
    throw new ValidationError("Please provide a valid email address");
  }

  params.role = role.id;

  const user = await strapi.query("plugin::users-permissions.user").findOne({
    where: { email: params.email },
  });

  if (user && user.provider === params.provider) {
    throw new ApplicationError("Email is already taken");
  }

  if (user && user.provider !== params.provider && settings.unique_email) {
    throw new ApplicationError("Email is already taken");
  }

  try {
    if (!settings.email_confirmation) {
      params.confirmed = true;
    }

    const user = await getService(strapi, "user").add(params);

    const sanitizedUser = await sanitizeUser(user, ctx);

    // await initUserData(strapi, user);
    // const codeResp = await createReferralCode(
    //   strapi,
    //   ctx,
    //   user,
    //   generateReferralCode(user.username)
    // );
    // await createReferralHistory(strapi, ctx, user);
    // const walletsResp = await strapi.db.query("api::wallet.wallet").findMany({
    //   where: {
    //     user: user.id,
    //   },
    // });

    // sanitizedUser["referral_code"] = codeResp;
    // sanitizedUser["wallets"] = walletsResp;

    if (settings.email_confirmation) {
      try {
        await getService(strapi, "user").sendConfirmationEmail(sanitizedUser);
      } catch (err) {
        throw new ApplicationError(err.message);
      }

      return ctx.send({ user: sanitizedUser });
    }

    const jwt = getService(strapi, "jwt").issue(_.pick(user, ["id"]));

    return {
      jwt,
      user: sanitizedUser,
    };
  } catch (err) {
    if (_.includes(err.message, "username")) {
      throw new ApplicationError("Username already taken");
    } else if (_.includes(err.message, "email")) {
      throw new ApplicationError("Email already taken");
    } else {
      strapi.log.error(err);
      throw new ApplicationError("An error occurred during account creation");
    }
  }
};

module.exports = {
  registerUser,
  createSessionRecord,
};
