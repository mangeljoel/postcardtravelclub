'use strict';
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/chats/startchat',
      handler: 'chat.startchat',
      config: {
        auth: false,
      },
    },

    {
      method: 'POST',
      path: '/chats/suggestQuestions',
      handler: 'chat.suggestQuestions',
      config: {
        auth: false,
      },
    },
    {
  method: 'POST',
  path: '/chats/getDetailedInformation',
  handler: 'chat.getDetailedInformation',
  config: {
    auth: false,
  },
    }
  ],
};  