module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/albums/findCountries',
      handler: 'album.findCountries',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/albums/getCountryStats',
      handler: 'album.getCountryStats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/albums/getRegionStats',
      handler: 'album.getRegionStats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/albums/getThemeStats',
      handler: 'album.getThemeStats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/albums/getInterestStats',
      handler: 'album.getInterestStats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/albums/all-countries-stats',
      handler: 'album.getAllCountriesStats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/albums/all-regions-stats',
      handler: 'album.getAllRegionsStats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/albums/all-themes-stats',
      handler: 'album.getAllThemesStats',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/albums/all-interests-stats',
      handler: 'album.getAllInterestsStats',
      config: {
        auth: false,
      },
    },
    // End of new routes
    {
      method: 'GET',
      path: '/albums/bytag',
      handler: 'album.findbyTag',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/albums/gettags',
      handler: 'album.getTags',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/albums/getAlbums',
      handler: 'album.getAlbums',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/albums/getAlbumswithFilters',
      handler: 'album.getAlbumswithFilters',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/albums/getFilters',
      handler: 'album.getFilters',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/albums/getAutoCompleteItems',
      handler: 'album.getAutoCompleteItems',
      config: {
        auth: false,
      },
    },
  ],
};