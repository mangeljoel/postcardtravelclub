module.exports = () => {
  return async (ctx, next) => {
    await next();

    if (ctx.request.url.startsWith('/uploads/')) {
      ctx.set('Cache-Control', 'public, max-age=6000, immutable');
    }
  };
};
