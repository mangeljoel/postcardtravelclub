
module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/postcards/getPostcards',
            handler: 'postcard.getPostcards',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/postcards/getFilters',
            handler: 'postcard.getFilters',
            config: {
                auth: false,
            },
        },
         {
            method: 'GET',
            path: '/postcards/getAllStats',
            handler: 'postcard.getAllStats',
            config: {
                auth: false,
            },
        },
          {
            method: 'GET',
            path: '/postcards/getAutoCompleteItems',
            handler: 'postcard.getAutoCompleteItems',
            config: {
                auth: false,
            },
        }
    ],
};