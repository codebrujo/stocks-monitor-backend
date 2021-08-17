const path = require('path');

// import .env variables
require('dotenv-safe').config({
    path: path.join(__dirname, '../../.env'),
    sample: path.join(__dirname, '../../.env.example'),
    allowEmptyValues: true,
});

module.exports = {
    env: 'test',
    port: process.env.PORT || process.env.DEFAULT_PORT,
    jwtSecret: 'SECRETPASSPHRASE',
    logs: 'combined',
    pgConfig: {
        db: `${process.env.POSTGRES_DB}_test`,
        port: process.env.POSTGRES_PORT,
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        passwd: process.env.POSTGRES_PASSWORD,
    },
    sessionParams: {
        sid: 'Zrh9WmD5Ty0NkUexmWPb1JAvNFohmbMj',
        data: '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":1},"userId":1}',
        cookie: 's%3AZrh9WmD5Ty0NkUexmWPb1JAvNFohmbMj.8xlVlfdFmwqumqO%2Ffp0vpa1OKw9H5aTsEdPWbq6CoWg',
    },
    mockUserDefaults: {
        oauthId: '17730',
        oauthToken: '',
        oauthTokenExp: 1622636196,
        oauthRefreshToken: 'eyJ4LWVudiI6IlBSRCIsIngtcmVnIjoiU0lNIiwidG9rZW4iOiI5NzA2OWQ0MC1jMDg0LTQyNjgtOTliMy1kNWNhNzk4MDBlYmIifQ==',
    },
    homeConnectConfig: {
        clientID: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_SECRET,
        callbackURL: '/auth/connect/callback',
        authorizationURL: '/security/oauth/authorize',
        tokenURL: '/security/oauth/token',
        scope: ['IdentifyAppliance', 'Dishwasher', 'Monitor'],
        apiUrl: 'https://simulator.home-connect.com',
        homeappliancesUrl: '/api/homeappliances',
        deviceTypesFilter: ['Dishwasher'],
        requestsCacheAliveTime: 300000,
        isSimulated: false,
        isMock: true,
        mockEventServerUrl: 'http://localhost:3002',
    },
    sequelizeOptions: {
        dialect: "postgres",
        port: process.env.POSTGRES_PORT,
        host: process.env.POSTGRES_HOST,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false,
    },
};