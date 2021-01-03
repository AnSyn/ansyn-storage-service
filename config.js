const config = {
    port: process.env.PORT || 8080,
    defaultUser: 'AnSyn',
    backend: {
        elasticport: process.env.ELASTIC_PORT || 9200,
        type: process.env.BACKEND_TYPE || 'elasticsearch',
        hosts: process.env.BACKEND_HOSTS ? process.env.BACKEND_HOSTS.split(',') : ['platform.ansyn.io'],
        credentials: process.env.BACKEND_CREDENTIALS || 'user:password',
        schemaPrefix: process.env.BACKEND_SCHEMA_PREFIX || 'ansyn-dev-'
    }
};

module.exports = config;
