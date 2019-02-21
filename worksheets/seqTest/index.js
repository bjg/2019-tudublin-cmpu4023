const express = require('express');
const http = require('http');
const Sequelize = require('sequelize');
const path = require('path');
const router = require('./routes/api');

const db = require('./config/database');
const app = express();

var bodyParser = require('body-parser')
//const users = require('./models/users');

   //database



//app.get('/', (req, res) => res.send('index'));

//Purchases route
//app.use('/purchased',require('./routes/purchased'));

//Purch_items route
app.use('/Purch_items',require('./routes/Purch_items'));
 
//product route
//app.use('/product',require('./routes/product'));

//app.use('/prod',require('./routes/product'));


//user route
app.use('/user',require('./routes/user'));

db.authenticate()
  .then(() => {
    console.log('Connection to the DB has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

 app.use('/',router)
  
http.createServer(app).listen(3002);

module.exports= router;