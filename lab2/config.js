module.exports = {
    port: 3003,
    dbConnectionString:'postgres://postgres:postgres@localhost:5432/lab2',
    saltRounds: 2,
    jwtSecret: 'ag_ag_secret_ag_ag_secret',
    tokenExpireTime: '24h'
}