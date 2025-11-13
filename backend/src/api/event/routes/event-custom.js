
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/events/stats',
      handler: 'event.getStats'
    },
    {
      method: 'GET',
      path: '/events/totalStats',
      handler: 'event.getTotalStats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/events/affiliationStats',
      handler: 'event.getAffilStats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/events/companyStats',
      handler: 'event.getCompStats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/events/albumStats',
      handler: 'event.getAlbumStats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/events/postcardStats',
      handler: 'event.getPostcardStats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/events/getAlbumsSorted',
      handler: 'event.getAlbumsSorted',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/events/getPostcardsSorted',
      handler: 'event.getPostcardsSorted',
      config: {
        auth: false,
      },
    },
  ],
};