/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 2
 *	Questions: All
 *	Type: Server"
 ***/

const express = require('express');
const massive = require('massive');
const app = express();
const router = express.Router();

const bodyParser = require('body-parser');
const expressBearerToken = require('express-bearer-token');

const config = require('./config.js');
const responseCode = require('./response/response');

massive({
    /* Databse Setup */
    host: config.HOST_DB,
    port: config.PORT_DB,
    database: config.DATABASE_NAME_DB,
    user: config.USER_DB,
    password: config.PASSWORD_DB
    
}).then(instance => {

    // Setting Database.
    app.set('db', instance);   
});

app.use(bodyParser.json());
app.use(expressBearerToken());

// Auth Routes
app.use('/signin', require('./auth/auth.js'));
app.use('/jwt', require('./auth/jwt.js'));
app.use('/hmac', require('./auth/hmac.js'));

// Routes
let routes = require('./routes.js');
routes(app);

app.use( (req, res) => {
    responseCode.responseNotFound(res, "Error 404: Page Not Found.");
});

module.exports = app;