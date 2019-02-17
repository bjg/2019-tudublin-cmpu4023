
const express = require('express');
const sequelize = require('sequelize');
const app = express();
const db = new sequelize('postgres://postgres:password@127.0.0.1:5432/pgguide');

app.use(express.json());
app.use(express.urlencoded());

//check connection to postgres database
db.authenticate().then(() => {
	console.log('Connection to database successful! :)');
}).catch(err => {
	console.log('Unable to connect to the database :( '+err);
})
const port = 3000;

app.listen(port, () => console.log(`Express, listening on port ${port}!`));


