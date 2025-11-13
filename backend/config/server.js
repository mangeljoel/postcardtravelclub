module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1336),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('BASE_URL', 'http://localhost:1336'),
});
