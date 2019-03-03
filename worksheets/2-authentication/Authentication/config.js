/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 2
 *	Questions: All
 *	Type: Config"
 ***/

const fs = require("fs");

module.exports = {
    HOST_DB: '127.0.0.1',
    PORT_DB: 5432,
    DATABASE_NAME_DB: 'pgguide',
    USER_DB: 'gg',
    PASSWORD_DB: 'qqqq',
    PORT_APP: 3000,
    MAIN_URL_APP: 'http://localhost:3000/',
    PRIVATE_KEY: fs.readFileSync("./keys/private.key"),
    PUBLIC_KEY: fs.readFileSync("./keys/public.key")
}
