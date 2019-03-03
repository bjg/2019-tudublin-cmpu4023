module.exports = {
    port: 3000,
    dbConnectionString: 'postgres://alex@localhost:5432/lab2',
    saltRounds: 2,
    jwtSecret: 'thisissecretpasswordthatnobodycanfindout',
    tokenExpireTime: '24h',
    jwtAccessKey: 'thisismyoneaccesskey'
}



