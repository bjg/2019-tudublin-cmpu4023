const express = require('express');
const router = express.Router();
const path = require("path");
const usersObj = require('../models/users');
const Users = usersObj.get('Users');
const productsObj = require('../models/products');
const Products = productsObj.get('Products');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const methods = require('./methods');
const fs = require("fs");
var bodyParser = require('body-parser')
router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({
    extended: true
}));
module.exports.verifyToken = function (req, res, next) {
        var bearerHeader = req.headers["authorization"]
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(" ")
            const bearerToken = bearer[1]

            jwt.verify(bearerToken, 'SECRET_KEY', (err, result) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(403)
                    } else {
                        next();
                    }
                })
            }else{
                console.log('error');
                    res.sendStatus(403)
                }
}


function authenticate(username, password_clear, res, async) {
    Users.findOne({
        where: {
            username: username
        }
    }).then(function (user) {
        if (!user) {
            return res.status(401).json({
                message: "Auth Failed. not valid user"
            });
        } else {
            bcrypt.compare(password_clear, user.password, function (err, result) {
                if (result == true) {
                    
                    var opts = {};
                    opts.expiresIn = '1h';
                 
                    const secret = "SECRET_KEY";
                    var token = null;

                    {
                        token = jwt.sign(
                            {
                                username,
                                id: user.id,
                          
                            
                        },secret,opts);
                    }
                    
    
                  

                    return res.status(200).json({
                        message: "Auth Passed",
                        userid:user.id,
                        expiresIn: opts.expiresIn,
                        token
                    });                   
                }
                return res.status(401).json({
                    message: "Auth Failed"
                });
            });
        }
    });
}


router.get('/', (req, res, next) => {
    res.render('home', {title:'Authentication works!'});
});

router.get('/users', (req, res, next) => {

    Users.findAll().then(users => {
        res.send({
            status: 200,
            users
        });
    }).catch(err => {
        console.log(err)
        res.send(400);
    });
});

router.get('/products', (req, res, next) => {
    Products.findAll().then(products => {
        res.send(products);
    }).catch(err => {
        console.log(err)
        res.send({
            status:200,
            products
        });
    });
});


router.post('/authenticated/login', (req, res) => {
    const username = req.body.username;
    const password_clear = req.body.password;
    authenticate(username, password_clear, res, async=false);
});


router.get("/protected", methods.verifyToken, (req, res, next) => {
    res.send({
        status: 200,
        message: "Token has been Verified!",
        token: req.headers["authorization"]
    });
   });


router.get('/protected/products',methods.verifyToken, (req, res, next) => {

    Products.findAll().then(products => {
        res.send({
            status: 200,
            products
        });
    }).catch(err => {
        console.log(err)
        res.send(400);
    });
});

router.get('/protected/users',methods.verifyToken, (req, res, next) => {

    Users.findAll().then(users => {
        res.send({
            status: 200,
            users
        });
    }).catch(err => {
        console.log(err)
        res.send(400);
    });
});


module.exports = router

