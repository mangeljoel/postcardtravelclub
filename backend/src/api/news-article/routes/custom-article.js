module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/articlesubmit',
        handler: 'news-article.submitForApproval'
      },
      {
        method: 'GET',
        path: '/articleapprove',
        handler: 'news-article.approve'
    },
      {
        method: 'GET',
        path: '/news-articles/articlepublish',
        handler: 'news-article.publish',
         config: {
          auth: false,
        }
      },

        {
          method: 'GET',
          path: '/articlereject',
          handler: 'news-article.reject'
        },

    ],
  };
