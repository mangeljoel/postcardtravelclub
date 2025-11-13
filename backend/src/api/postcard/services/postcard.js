'use strict';
const redisClient = require("../../../utils/redis");
/**
 * postcard service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::postcard.postcard', ({ strapi }) => ({
      CACHE_KEY: 'postcards:mindful-luxury-hotels',
  CACHE_TTL: 3600, // 1 hour
   /**
   * Get cached postcards for mindful luxury hotels
   * @param {boolean} forceRefresh - Force refresh from database
   * @returns {Array} Postcards array
   */
  async cachePostcards(forceRefresh = false) {
    let postcards = null;
    let redisConn = null;

    try {
      await redisClient.connect();
      redisConn = redisClient.getConnection();
      console.log('✅ Redis connected');
    } catch (redisError) {
      console.error('❌ Redis connection error:', redisError);
    }

    // Try cache first
    if (redisConn && !forceRefresh) {
      console.log('✅ Checking cache...');
      try {
        const cachedData = await redisConn.get(this.CACHE_KEY);

        if (cachedData) {
          postcards = JSON.parse(cachedData);
          console.log(`✅ Loaded from cache (${postcards.length} items)`);
          return postcards;
        } else {
          console.log('⚠️  Cache miss');
        }
      } catch (cacheError) {
        console.error('❌ Cache get error:', cacheError);
      }
    }

    // Fetch from database
    console.log('🔄 Fetching from database...');

    try {
      postcards = await strapi.entityService.findMany('api::postcard.postcard', {
        filters: {
          isComplete: true,
          album: {
            directories: {
              slug: { $in: ['mindful-luxury-hotels'] }
            }
          }
        },
        populate: {
          album: {
            populate: {
              country: { populate: ['coverImage'] },
              region: {
                populate: {
                  country: {
                  fields:["name"]
                }
              }},
              directories: true,
            },
          },
          tags: {
            populate: {
              tag_group:
              {
                populate: {
              coverImage:{
                fields:["url"]
              }
            }} },
          },
        },
        pagination: { limit: -1 },
      });

      console.log(`✅ Fetched ${postcards.length} postcards`);

      // Store in cache
      if (redisConn && postcards && postcards.length > 0) {
        try {
          await redisConn.sendCommand([
            'SETEX',
            this.CACHE_KEY,
            this.CACHE_TTL.toString(),
            JSON.stringify(postcards)
          ]);
          console.log(`💾 Cached ${postcards.length} postcards (TTL: ${this.CACHE_TTL}s)`);
        } catch (cacheError) {
          console.error('❌ Cache error:', cacheError);
        }
      }

      return postcards;
    } catch (dbError) {
      console.error('❌ Database query error:', dbError);
      throw dbError;
    }
  },

  /**
   * Clear the postcards cache
   */
  async clearPostcardsCache() {
    try {
      await redisClient.connect();
      const redisConn = redisClient.getConnection();

      await redisConn.del(this.CACHE_KEY);
      console.log('✅ Postcards cache cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
      return false;
    }
  },

  /**
   * Warm up the cache
   */
  async warmCache() {
    console.log('🔥 Warming postcards cache...');
    await this.cachePostcards(true);
    console.log('✅ Cache warmed');
    return true;
  },

  /**
   * Get cache info
   */
  async getCacheInfo() {
    try {
      await redisClient.connect();
      const redisConn = redisClient.getConnection();

      const exists = await redisConn.exists(this.CACHE_KEY);
      const ttl = await redisConn.ttl(this.CACHE_KEY);

      return {
        available: true,
        cached: exists === 1,
        ttl: ttl > 0 ? ttl : null,
        expiresIn: ttl > 0 ? `${Math.floor(ttl / 60)}m ${ttl % 60}s` : 'N/A',
        key: this.CACHE_KEY,
      };
    } catch (error) {
      console.error('❌ Error:', error);
      return { available: false, error: error.message };
    }
    },
   async refreshCache() {
    console.log('🔄 Refreshing postcards cache...');

    try {
      // Clear first
      await this.clearPostcardsCache();
      // Then reload
      const postcards = await this.cachePostcards(true);

      console.log(`✅ Cache refreshed with ${postcards.length} postcards`);
      return postcards;
    } catch (error) {
      console.error('❌ Error refreshing cache:', error);
      throw error;
    }
  },
}));
