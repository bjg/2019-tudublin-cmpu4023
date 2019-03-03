var express = require('express');
var methods = require("../methods")
var router = express.Router();

router.get('/', methods.ensureToken, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
