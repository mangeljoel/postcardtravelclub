module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/tags-get-create',
      handler: 'tag.getOrCreate'
    },

    {
      method: 'GET',
      path: '/tags/gettagsbydirectory',
      handler: 'tag.getTagsbyDirectory',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/tags/getTags',
      handler: 'tag.getTags',
      config: {
        auth: false
      },
    },
  ],
};
