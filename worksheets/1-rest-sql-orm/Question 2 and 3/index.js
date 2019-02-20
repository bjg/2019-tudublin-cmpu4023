var express = require('express')
var app = express();
var Massive = require("massive");
var http = require('http');

// Connect to database with sequelize 
var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://postgres:123456@localhost:5432/pgguide');


var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));




// Part 2

// hackable version this function 
app.get('/products', function (req, res) {
db.run(`select * from products where title='${req.query.name}'`, function(err, data){
res.send(data);
})
})

// Part 3

// Parametertised version function 
app.get('/products', function (req, res) {
db.run(`select * from products where title=$1`, [req.query.name], function(err, data){
res.send(data);
 })
})


//// listening on port 3000
//http.createServer(app).listen(3000);


// listening on port 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})




