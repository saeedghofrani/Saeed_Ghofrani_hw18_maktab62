// Module dependencies.
require('dotenv').config();

// get environment
const env = process.env.NODE_ENV;

// development environment variables
const development = {
    // app variable (port)
    app: {
        port: parseInt(process.env.DEV_APP_PORT) || 3000
    },
    //database variable (DBhost, DBport, DBname)
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'ESTER'
    },
    //session secret key 
    session: {
        sessionSecret: process.env.DEV_SESSION_SECRET
    },
    //admin information for first run
    admin: {
        firstName: process.env.ADMIN_FIRSTNAME,
        lastName: process.env.ADMIN_LASTNAME,
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        role: process.env.ADMIN_ROLE,
        phone: process.env.ADMIN_PHONE,
    }
};
// 
const production = {
    // app variable (port)
    app: {
        port: parseInt(process.env.DEV_APP_PORT) || 3000
    },
    //database variable (DBhost, DBport, DBname)
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'ESTER'
    },
    //session secret key 
    session: {
        sessionSecret: process.env.DEV_SESSION_SECRET
    },
    //admin information for first run
    admin: {
        firstName: process.env.ADMIN_FIRSTNAME,
        lastName: process.env.ADMIN_LASTNAME,
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        role: process.env.ADMIN_ROLE,
        phone: process.env.ADMIN_PHONE,
    }
};

const config = {
    development,
    production
};

module.exports = config[env];