const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const massive = require('massive');
const bodyParser = require('body-parser');
var urlencodeds = bodyParser.urlencoded({extended: false});

massive({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
  }).then(db => { 


});


app.listen(3000, ()  => console.log('Server started on prot 3000'));