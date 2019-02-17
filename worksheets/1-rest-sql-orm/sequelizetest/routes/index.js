var express = require('express');
var router = express.Router();
var models = require('../models/index');

router.get('/users', function(req, res) {
  models.users.findAll({}).then(function(users) {
    res.json(users);
  });
});