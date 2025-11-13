module.exports = ({ env }) => ({
    'users-permissions': {
      config: {
        jwt: {
          expiresIn: '7d',
        },
      },
    },
    sentry: {
      dsn: env("NODE_ENV") === "development" ? null : env("SENTRY_DSN"),
      sendMetadata: true,
    },
    email: {
      config: {
        provider: "amazon-ses",
        providerOptions: {
            key: 'AKIA2WK4JRLHXNWMOQF3',
            secret: '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',
            amazon: 'https://email.ap-south-1.amazonaws.com',
        },
        settings: {
            defaultFrom: 'no-reply@postcard.travel',
            defaultReplyTo: 'no-reply@postcard.travel',
          },
      },
    },
    'import-export-entries': {
      enabled: true,
    },
    redis: {
      config: {
        connections: {
          default: {
            connection: {
              host: "127.0.0.1",
              port: 6379,
              db: 0,
            },
            settings: {
              debug: false,
              cluster: false,
            },
          },
        },
      },
    },
    "rest-cache": {
      enabled: true,
      config: {
        provider: {
          name: "memory",
          // getTimeout: 500, // in milliseconds (default: 500)
          options: {
            max: 327670,
            maxAge: 9999000,
          },
        },
        strategy: {
          contentTypes: [
            // list of Content-Types UID to cache
            // "api::postcard.postcard",
            // "api::album.album",
            // "api::country.country",
            // "api::user-type.user-type",
          ],
        },
      },
    },
    upload: {
      config: {
        provider: "strapi-provider-upload-aws-s3-advanced",
        providerOptions: {
          accessKeyId: env("AWS_ACCESS_KEY_ID"),
              quality: 100,
          secretAccessKey: env("AWS_ACCESS_SECRET"),
          region: env("AWS_REGION"),
          params: {
            Bucket: env("AWS_BUCKET"),
            CacheControl: "public, max-age=31536000, immutable",
          },
          baseUrl: env("CDN_BASE_URL"), // e.g. https://cdn.example.com, this is stored in strapi's database to point to the file
          prefix: env("BUCKET_PREFIX"), // e.g. strapi-assets, note the missing slash at the start
        },
      },
    },
    seo: {
      enabled: true,
    },
    transformer: {
      enabled: true,
      config: {
        prefix: "/api/",
        responseTransforms: {
            removeAttributesKey: true,
            removeDataKey: true,
          }
      },
    },
    "email-designer": {
      enabled: true,

      // ⬇︎ Add the config property
      config: {
        editor: {
          // optional - if you have a premium unlayer account
          tools: {
            heading: {
              properties: {
                text: {
                  value: "This is the new default text!",
                },
              },
            },
          },
          options: {
            features: {
              colorPicker: {
                presets: ["#D9E3F0", "#F47373", "#697689", "#37D67A"],
              },
            },
            fonts: {
              showDefaultFonts: false,
              /*
               * If you want use a custom font you need a premium unlayer account and pass a projectId number :-(
               */
              customFonts: [
                {
                  label: "Anton",
                  value: "'Anton', sans-serif",
                  url: "https://fonts.googleapis.com/css?family=Anton",
                },
                {
                  label: "Lato",
                  value: "'Lato', Tahoma, Verdana, sans-serif",
                  url: "https://fonts.googleapis.com/css?family=Lato",
                },
                // ...
              ],
            },
            mergeTags: [
              {
                name: "Email",
                value: "{{= USER.username }}",
                sample: "john@doe.com",
              },
              // ...
            ],
          },
          appearance: {
            theme: "dark",
            panels: {
              tools: {
                dock: "left",
              },
            },
          },
        },
      },
  },
      documentation: {
    enabled: true,
    config: {
      info: {
        version: '1.0.0',
        title: 'API Documentation',
        description: 'My Strapi v4.15.0 API Docs',
      },
    },
  },
    "website-builder": {
      enabled: true,
      config: {
        url: "https://postcard.travel/api/revalidatex?secret=postcard0909090909090909",
        trigger: {
          type: "manual",
        },
      },
    },
    chartbrew: true
  });
