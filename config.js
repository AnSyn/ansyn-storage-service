const config = {
    port: process.env.PORT || 8080,
    backend: {
        type: process.env.BACKEND_TYPE || 'mongodb',
        hosts: process.env.BACKEND_HOSTS ? process.env.BACKEND_HOSTS.split(',') : ['ansyn.io'],
        credentials: process.env.BACKEND_CREDENTIALS || 'user:password',
        schemaPrefix: process.env.BACKEND_SCHEMA_PREFIX || ''
    }
};

module.exports = config;
