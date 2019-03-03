const fs = require("fs");

module.exports = {
	DB_HOST: '127.0.0.1',
	DB_PORT: 5432,
	DB_NAME: 'pgguide',
	DB_USER: 'pgpaul',
	DB_PASSWORD: 'password',
	APP_PORT: 3000,
	// keys stored in separate files
	PRIVATE_KEY: fs.readFileSync("./keys/privateKey.key"),
	PUBLIC_KEY: fs.readFileSync("./keys/publicKey.key.pub")
}


