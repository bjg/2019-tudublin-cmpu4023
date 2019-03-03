const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const massive = require('massive');
const config = require('./config.js');
const router = express.Router();
const bearerToken = require('express-bearer-token');

const app = express()

//massive configuration
massive({
	host: config.DB_HOST,
	port: config.DB_PORT,
	database: config.DB_NAME,
	user: config.DB_USER,
	password: config.DB_PASSWORD
  }).then(instance => {
	app.set('db', instance);
  });


	app.use(bodyParser.json());
	app.use(bearerToken());
//********************************************************************************
// use authentication
app.use('/basic', require('./auth/auth.js'));
app.use('/jwt', require('./auth/JWT_Auth.js'));
app.use('/hmac', require('./auth/HMAC_Auth.js'));


//********************************************************************************
module.exports = app;
// Apply routes
var routers = require('./routers/routers.js');
routers(app);


app.use( (req, res) => {
	res.status(404).json({
		"status": "Not Found",
		"message": "Page Not Found"
	  });
  });

//********************************************************************************


// app.get('/', (req, res) => {
// 	res.send('Hey!')
// })
//********************************************************************************



app.listen(config.APP_PORT, () => {
	console.log("Server running on port: " + config.APP_PORT);
  });
  


