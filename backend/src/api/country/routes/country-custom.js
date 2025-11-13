module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/country/getCountries',
            handler: 'country.getCountries',
            config: {
                auth: false
            },
        },
        {
            method: 'GET',
            path: '/country/:countrySlug/:regionSlug',
            handler: 'country.getCountryRegionData',
            config: {
                auth: false
            },
        },
        
    ]
}