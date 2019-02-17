const Massive = require("massive");

module.exports =  Massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide',
    user: 'pgguide_user',
    password: '123',
    ssl: false,
    poolSize: 10
});