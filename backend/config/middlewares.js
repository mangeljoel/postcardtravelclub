module.exports = ({ env }) => [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'script-src': ["'self'", "editor.unlayer.com"],
          'connect-src': ["'self'", 'http', 'https:'],
          "frame-src": ["'self'", "editor.unlayer.com"],
          'img-src': ["'self'", 'data:', 'blob:',`${env("CDN_BASE_URL")}`,"cdn.jsdelivr.net","strapi.io","s3.amazonaws.com"],
          'media-src': ["'self'", 'data:', 'blob:',`${env("CDN_BASE_URL")}`],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  {
    name: "strapi::body",
    config: {
      formLimit: "256mb", // modify form body
      jsonLimit: "256mb", // modify JSON body
      textLimit: "256mb", // modify text body
      formidable: {
        maxFileSize: 200 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
      
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
 
];
