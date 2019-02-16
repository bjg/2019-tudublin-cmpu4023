'use strict'
const express = require('express'),
 db = require('./server/models/index'),
 bodyParser = require('body-parser'),
 router = require('./server/router/router');

const app = express()
const port = 3000
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});
router(app,db);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));