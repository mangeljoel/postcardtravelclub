module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/category/getCategories',
            handler: 'category.getCategories',
            config: {
                auth: false
            },
        },
    ],
};
