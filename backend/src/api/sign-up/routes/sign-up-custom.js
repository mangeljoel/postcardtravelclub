module.exports = {
    routes: [
      {
        "method": "POST",
        "path": "/sign-up/custom/validate",
        "handler": "sign-up.validate",
        config: {
          auth: false,
        },
      },
      {
        "method": "POST",
        "path": "/sign-up/custom/getURLMetadata",
        "handler": "sign-up.getURLMetadata",
        config: {
          auth: false,
        },
      },
      
    ],
  };
  