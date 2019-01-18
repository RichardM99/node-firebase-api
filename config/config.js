const env = process.env.Node_ENV || 'development';

const config = {
    development: {
        env:'development',
        port: '2000',
        firebase: {
            webAPIKey: "add your webAPIKey here"
        }
    },
    production: {
        env:'production',
        port: '2000',
        firebase: {
            webAPIKey: "add your webAPIKey here"
        }
    }
};

module.exports = config[env];