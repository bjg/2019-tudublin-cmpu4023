var express = require("express");
var app = express();

var massive = require("massive");
var connectionString = "postgres://myuser:mypass@localhost/lab2";

// Set a reference to the massive instance on Express' app:
massive(connectionString).then(massiveInstance => {
    app.set('db', massiveInstance);
   
});
module.exports=app