const fs = require("fs");

module.exports = {
	db.host: 'localhost',
	DB_PORT: 5432,
	DB_NAME: 'lab2',
	DB_USER: 'admin1',
	db_PASSWORD: 'password',
	app_port: 3000,
	PRIVATE_KEY:fs.readFileSync("keys/privateKey.key"),
	PUBLIC_KEY:fs.readFileSync(".keys/publicKey.key")
}
