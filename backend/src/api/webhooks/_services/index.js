const redisClient = require("../../../services/redis");
const { REDIS_KEYS } = require("../../../../config/constants");
const constants = require("../../../../config/constants");

const rewardReferenceUser = async (strapi, userId) => {
  const referenceUser = await strapi.db.query().findOne({
    where: {
      user: userId,
    },
  });

  if (referenceUser) {
    await redisClient.connect();
      
    const appConfig = await redisClient.getValue(REDIS_KEYS.APP_CONFIG);
    let currencies = await redisClient.getValue(REDIS_KEYS.CURRENCY);

    const bonusCurrency = currencies.find((curr) => curr.type == "bonus");

    const referenceUserWallets = await strapi.entityService.findMany(
      "api::wallet.wallet",
      {
        populate: "*",
        filters: {
          user: referenceUser?.id,
          currency: bonusCurrency.id
        },
      }
    );

    if (referenceUserWallets.length > 0) {
      
      await redisClient.connect();
      const transaction = {
        type: constants.TRANS_TYPE.CREDIT,
        source: "event",
        user: referenceUser?.id,
        currency: bonusCurrency.id,
        amount: Number(appConfig?.referralDepositBonusAmount),
        status: Constants.TRANS_STATUS.SUCCESS,
        eventmaster:6
      };
      strapi.service("api::transaction.transaction").create({data:transaction});
   
    }
  }
};

module.exports = {
  rewardReferenceUser,
};
