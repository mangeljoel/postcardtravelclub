module.exports = {
  responses: {
    privateAttributes: ['_v','publishedAt','formats'],
  },
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
};
