module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/tag-groups/getTagGroups',
            handler: 'tag-group.getTagGroups',
            config: {
                auth: false
            },
        },
    ],
}