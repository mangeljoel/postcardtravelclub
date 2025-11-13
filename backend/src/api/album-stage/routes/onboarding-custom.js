module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/album-stages-verifykey',
        handler: 'album-stage.verifyKey'
      },
      {
        method: 'GET',
        path: '/album-stages-images-upload',
        handler: 'album-stage.submitimagesforreview'
      },
      
        {
          method: 'GET',
          path: '/album-stages-content-upload',
          handler: 'album-stage.submitcontentforreview'
        },
     
    ],
  };
  