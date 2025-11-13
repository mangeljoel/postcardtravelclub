const hasEventsDirectory = async (albumId, payloadDirectories) => {
  let finalIds = new Set();

  if (albumId) {
    const existing = await strapi.entityService.findOne('api::album.album', albumId, {
      populate: { directories: { fields: ['id'] } },
    });
    (existing?.directories || []).forEach(d => finalIds.add(d.id));
  }

  const ops = payloadDirectories || {};
  const connectIds = (ops.connect || []).map(x => (typeof x === 'object' ? x.id : x)).filter(Boolean);
  const disconnectIds = (ops.disconnect || []).map(x => (typeof x === 'object' ? x.id : x)).filter(Boolean);

  connectIds.forEach(id => finalIds.add(id));
  disconnectIds.forEach(id => finalIds.delete(id));

  const ids = Array.from(finalIds);
  if (ids.length === 0) return false;

  const dirs = await strapi.entityService.findMany('api::directory.directory', {
    filters: { id: { $in: ids } },
    fields: ['id','slug'],
    limit: ids.length,
  });
  console.log(dirs)

  return dirs.some(d =>
    (d.id && d.id == 9) ||
    (d.slug && d.slug.toLowerCase() === 'events')
  );
};

const ensureDateIfNeeded = async (event) => {
  const { data, where } = event.params;
  const albumId = where?.id ?? null;

  const needsDate = await hasEventsDirectory(albumId, data?.directories);

  if (needsDate) {
    const hasDate =
      data?.date ||
      (albumId
        ? (await strapi.entityService.findOne('api::album.album', albumId, { fields: ['id', 'date'] }))
            ?.date
        : null);

    if (!hasDate) {
      throw new Error('date is required when the album is linked to a directory of type "events".');
    }
  }
};


module.exports = {
  async beforeCreate(event) {
    await ensureDateIfNeeded(event);
  },

  async beforeUpdate(event) {
    await ensureDateIfNeeded(event);
  },

  async afterCreate(event) {
    strapi.service('api::album.album').cacheAlbumFilter();
    const { result, params } = event;
    const update = await strapi.entityService.update(
      "api::album.album",
      result.id,
      {
        data: {
          publishedAt: new Date().toISOString(),
        }
      }
    );
    console.log("album create result", result);
    console.log("album create params", params);

    const entry = await strapi.entityService.create(
      "api::album-stage.album-stage",
      {
        data: {
          user: params.data.user,
          state: "postcard-stories-upload",
          album: result.id,
          name: result.name,
          key: (result.name?.substring(0, 4) || 'NAMELESS') + Math.floor(Math.random() * 100)
        },
      }
    );
  },
  async afterUpdate(event) {
    strapi.service('api::album.album').cacheAlbumFilter();
  },
  async afterDelete(event) {
    strapi.service('api::album.album').cacheAlbumFilter();
  },
};
