module.exports = {
    async afterCreate(event) {
        strapi.service('api::album.album').cacheAlbumFilter();
        strapi.service('api::postcard.postcard').refreshCache();
    },
    async afterUpdate(event) {
        strapi.service('api::album.album').cacheAlbumFilter();
        strapi.service('api::postcard.postcard').refreshCache();
    },
    async afterDelete(event) {
        strapi.service('api::album.album').cacheAlbumFilter();
        strapi.service('api::postcard.postcard').refreshCache();
    },
};