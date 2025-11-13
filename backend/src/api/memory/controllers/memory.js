'use strict';

/**
 * memory controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// Filter configuration 
const MEMORY_FILTER_CONFIG = {
  year: {
    key: 'year',
    type: 'date',
    dbField: 'date',
    order: 1       
  },
  country: {
    key: 'country',
    type: 'relation',
    dbField: 'country',
    order: 2        
  },
  region: {
    key: 'region', 
    type: 'relation',
    dbField: 'region',
    order: 3        
  }
};

module.exports = createCoreController('api::memory.memory', ({ strapi }) => ({

  /**
   * Generic filter fetcher that respects privacy settings
   */
  async getFilters(ctx) {
    const { slug, isOwner, ...filterParams } = ctx.query;

   
    // console.log('Params:', { slug, isOwner, typeof: typeof isOwner, filterParams });

    if (!slug) {
      // console.log('No slug provided, returning empty response');
      return this.getEmptyFilterResponse();
    }

    try {
      const result = {};
      const orderedFilters = this.getOrderedFilters();

      // console.log('Processing filters in order:', orderedFilters.map(f => f.key));

      for (const filter of orderedFilters) {
        // console.log(`\n--- Processing ${filter.key} filter ---`);
        const whereCondition = this.buildWhereCondition(slug, filterParams, filter, isOwner);
        
        if (filter.type === 'date') {
          result[filter.key] = await this.getDateFilterOptions(whereCondition, filter.dbField);
        } else if (filter.type === 'relation') {
          result[filter.key] = await this.getRelationFilterOptions(whereCondition, filter.dbField);
        }
      }

     
      Object.keys(result).forEach(key => {
        // console.log(`${key}: ${result[key].length} options`);
      });
     
      return result;

    } catch (error) {
      // console.error('Error fetching memory filters:', error);
      return this.getEmptyFilterResponse();
    }
  },

  getOrderedFilters() {
    return Object.values(MEMORY_FILTER_CONFIG).sort((a, b) => a.order - b.order);
  },

  /**
   * Build where condition with privacy check
   */
  buildWhereCondition(slug, filterParams, currentFilter, isOwner) {
    const whereCondition = {
      user: { slug }
    };

   
    const isUserOwner = isOwner === true || isOwner === 'true';
    
    // console.log('Privacy check:', { slug, isOwner, isUserOwner, typeof: typeof isOwner });

    // If not owner, only show public memories with gallery
    if (!isUserOwner) {
      whereCondition.shareType = 'public';
      whereCondition.gallery = {
        $not: null
      };
      // console.log('Applied privacy filter - Public memories only');
    } else {
      // console.log('Owner view - showing all memories');
    }

   
    const precedingFilters = Object.values(MEMORY_FILTER_CONFIG)
      .filter(f => f.order < currentFilter.order)
      .map(f => f.key);

    // Add selected values for preceding filters
    precedingFilters.forEach(filterKey => {
      const value = filterParams[filterKey];
      if (value && parseInt(value) !== -1) {
        
        // Special handling for date filters 
        const filterConfig = MEMORY_FILTER_CONFIG[filterKey];
        if (filterConfig.type === 'date' && filterConfig.dbField === 'date') {
          // Convert year to date range
          const year = parseInt(value);
          whereCondition.date = {
            $gte: `${year}-01-01`,
            $lte: `${year}-12-31`
          };
        } else {
          whereCondition[filterKey] = parseInt(value);
        }
      }
    });

    
    return whereCondition;
  },

  async getRelationFilterOptions(whereCondition, dbField) {
   
    
    const memories = await strapi.db.query('api::memory.memory').findMany({
      where: whereCondition,
      populate: {
        [dbField]: { fields: ["id", "name"] },
        gallery: { fields: ["id"] }
      },
      fields: ['shareType'] // Include shareType for debugging
    });

    // console.log(`Found ${memories.length} memories for ${dbField}`);

    // Double-check privacy filtering if needed
    let filteredMemories = memories;
    
    // If we have shareType filter (meaning non-owner), do additional check
    if (whereCondition.shareType === 'public') {
      // console.log('Applying additional privacy filter...');
      
      const beforeFilter = filteredMemories.length;
      filteredMemories = memories.filter(memory => {
        const isPublic = memory.shareType === 'public';
        const hasGallery = memory.gallery && memory.gallery.length > 0;
        return isPublic && hasGallery;
      });
      
      // console.log(`Privacy filter: ${beforeFilter} → ${filteredMemories.length} memories`);
    }

    // Extract unique options from filtered memories
    const options = [];
    const seenIds = new Set();
    
    filteredMemories.forEach(memory => {
      const relationData = memory[dbField];
      if (relationData && !seenIds.has(relationData.id)) {
        seenIds.add(relationData.id);
        options.push(relationData);
      }
    });

    
    return options.sort((a, b) => a.name.localeCompare(b.name));
  },

  async getDateFilterOptions(whereCondition, dbField) {
   
    
    const memories = await strapi.db.query('api::memory.memory').findMany({
      where: whereCondition,
      fields: [dbField, 'shareType'],
      populate: {
        gallery: { fields: ["id"] }
      }
    });

    

    // Double-check privacy filtering if needed
    let filteredMemories = memories;
    
    if (whereCondition.shareType === 'public') {
      
      
      const beforeFilter = filteredMemories.length;
      filteredMemories = memories.filter(memory => {
        const isPublic = memory.shareType === 'public';
        const hasGallery = memory.gallery && memory.gallery.length > 0;
        return isPublic && hasGallery;
      });
      
      
    }

    const options = [];
    const seenValues = new Set();
    
    filteredMemories.forEach(memory => {
      if (memory[dbField]) {
        // For year extraction from date
        if (dbField === 'date') {
          const year = new Date(memory[dbField]).getFullYear();
          if (!isNaN(year) && year > 1900 && year <= new Date().getFullYear() && !seenValues.has(year)) {
            seenValues.add(year);
            options.push({
              id: year,
              name: year.toString(),
              value: year
            });
          }
        }
      }
    });

    
    // Sort years in descending order (newest first)
    return options.sort((a, b) => b.value - a.value);
  },

  /**
   * Return empty response for all configured filters
   */
  getEmptyFilterResponse() {
    const response = {};
    Object.keys(MEMORY_FILTER_CONFIG).forEach(key => {
      response[key] = [];
    });
    return response;
  }

}));