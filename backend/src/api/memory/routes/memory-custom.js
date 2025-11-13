'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/memories/getFilters',
      handler: 'memory.getFilters',
      config: {
        auth: false,
      },
    },
    
  ],
};