var express = require('express')
var app = express();

// Connect to database with sequelize 
var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://postgres:123456@localhost:5432/pgguide');


const models = require("./models");

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));



// get all purchases display the data
app.get('/purchases', function(req, res) {
  models.purchases.findAll({}).then(function(purchases) {
    res.json(purchases);
  });
});



// listening on port 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


