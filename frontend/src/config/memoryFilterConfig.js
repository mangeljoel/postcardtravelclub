// src/config/memoryFilterConfig.js

export const MEMORY_FILTER_CONFIG = {
  country: {
    key: 'country',
    label: 'Country',
    order: 2,
    type: 'relation', // relation, date, or custom
    dbField: 'country',
    nextFilter: 'region',
    allOption: { id: -1, name: 'All Countries' },
    emptyText: 'No Countries'
  },
  region: {
    key: 'region', 
    label: 'Region',
    order: 3,
    type: 'relation',
    dbField: 'region', 
    nextFilter: null,
    allOption: { id: -1, name: 'All Regions' },
    emptyText: 'No Regions',
    contextualEmpty: (filters) => filters.country ? ` in ${filters.country.name}` : ''
  },
  year: {
    key: 'year',
    label: 'Year', 
    order: 1,
    type: 'date',
    dbField: 'date',
    nextFilter: "country",
    allOption: { id: -1, name: 'All Years' },
    emptyText: 'No Years Available'
  }
  
  
};

// Helper functions
export const getFilterByOrder = () => {
  return Object.values(MEMORY_FILTER_CONFIG).sort((a, b) => a.order - b.order);
};

export const getFilterKeys = () => {
  return getFilterByOrder().map(f => f.key);
};

export const getNextFilter = (currentFilter) => {
  return MEMORY_FILTER_CONFIG[currentFilter]?.nextFilter;
};

export const isLastFilter = (currentFilter) => {
  return !getNextFilter(currentFilter);
};