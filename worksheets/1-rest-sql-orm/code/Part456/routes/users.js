var express = require('express');
var router = express.Router();
const UserController = require('../controllers/userController.js');

/*  TEST
 *  curl localhost:3000/users */
router.get('/', function(req, res, next) {
    UserController.findAll(req, res);
});

/*  TEST
 *  curl localhost:3000/users/1 */
router.get('/:id', function(req, res, next) {
    UserController.findByPk(req, res);
});

/*  TEST
    curl -X POST -d email=blah@gmail.com -d password=123445 localhost:3000/users */
router.post('/', function(req, res)
{
    UserController.create({ 
        email: req.body.email, 
        password: req.body.password, 
        details: req.body.details 
    }, res);
});

module.exports = router;
