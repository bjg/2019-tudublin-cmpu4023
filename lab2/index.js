const app = require('express')(); 
const bodyParser = require('body-parser');
const logger = require('morgan');
const http = require('http');
const massive = require('massive');
const router = require('express').Router();


// for parsing incoming request bodies
app.use(bodyParser.json());

// https://stackoverflow.com/questions/24543847/req-body-empty-on-posts
// for content type select "X-www-form-urlencoded" -- need this to grab the encrypted message from the request body
app.use(bodyParser.urlencoded({
  extended: true
}));

// for logging GET/PUT/POST/DELETE to console
app.use(logger('dev'));

// require the router file
require('./routes')(router);

// use the router
app.use(router);

// connect to database
massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'lab2',
  user: 'postgres',
  password: 'admin'
}).then(instance => {
	app.set('db', instance);
});

// create the server and listen on port 3000
http.createServer(app).listen(3000);