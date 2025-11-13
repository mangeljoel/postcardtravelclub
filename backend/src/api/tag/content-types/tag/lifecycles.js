module.exports = {
  async afterCreate(event) {
    strapi.service('api::album.album').cacheAlbums();
  },
  async afterUpdate(event) {
    strapi.service('api::album.album').cacheAlbums();
  },
  async afterDelete(event) {
    strapi.service('api::album.album').cacheAlbums();
  },
};
