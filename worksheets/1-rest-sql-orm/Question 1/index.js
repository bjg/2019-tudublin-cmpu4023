const express = require('express');
const http = require('http');
const massive = require('massive');
const app = express();


// Connect to database
massive({
host: '127.0.0.1',
port: 5432,
database: 'pgguide',
user: 'postgres',
password: '123456'
}).then(instance => {

app.set('db', instance);

////part 1

 // GET /users
app.get('/users', (req, res) => {
req.app.get('db').users.find({}).then(items => {
res.json(items);
});
});


// GET /users/:id
app.get('/users/:id', (req, res) => { 
var id = req.params.id;
req.app.get('db').users.find({id:id}).then(items => {
res.json(items);
});
});


// GET /products
app.get('/products', (req, res) => {
req.app.get('db').users.find({}).then(items => {
res.json(items);
});
});

// // // GET /products/:id
app.get('/products/:id', (req, res) => {
var id = req.params.id; 
req.app.get('db').users.find({id:id}).then(items => {
res.json(items);
});
});

// GET /purchases
app.get('/purchases', (req, res) => {
req.app.get('db').users.find({}).then(items => {
res.json(items);
});
});



 // Part3

// This code is Stored Procedure
app.get('/products/:name', (req, res) => {
var name = req.params.name;
req.app.get('db').products.find({title:name}).then(items => {
res.json(items);
});
});

// listening on port 3000
   http.createServer(app).listen(3000);
  console.log('Server listening on port 3000!')
});

