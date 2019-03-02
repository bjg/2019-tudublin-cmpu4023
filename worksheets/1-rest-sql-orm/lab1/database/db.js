//////////// Database object creating ///////////////
const express = require('express');
var app = express();
var massive = require("massive");
var connectionString = "postgres://postgres:7512@localhost:5432/pgguide";

massive(connectionString).then(massiveInstance => {
    app.set('db', massiveInstance);
});

module.exports = app;