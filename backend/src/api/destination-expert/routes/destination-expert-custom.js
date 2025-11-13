module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/destination-expert/getExpertData/:dxId',
            handler: 'destination-expert.getExpertData',
            config: {
                auth: false,
            },
        },
    ]
};