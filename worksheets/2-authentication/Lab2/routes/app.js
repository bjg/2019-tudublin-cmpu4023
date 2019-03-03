const express = require('express');
const path = require('path');

const products = require('../models/Products');
const users = require('../models/Users');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

let Ofuda = require('ofuda');
let hmac = new Ofuda({
    headerPrefix: 'Amz',
    hash: 'sha1',
    serviceLabel: 'AWS',
    debug: true
});

//Instantiate express router
const router = express.Router();

/// PROBLEM SET 2 ///
// Authenticate user synchronously
router.post('/authenticate/sync', (req, res) => {
    authenticateUser(req.body.username, req.body.password, res, async=false)
});

// Authenticate user Asynchronously
router.post('/authenticate/async', (req, res) => {
    authenticateUser(req.body.username, req.body.password, res, async=true)
});

// Check if token is valid
router.get('/tokenvalidation/', tokenValidation, (req, res, async=false, next) => {
    res.send({
        status: 200,
        message: 'Token verified....',
        token: req.headers['authorization']
    });
});

// Get all users
router.get('/users', tokenValidation, (req, res, async=false, then) =>
    users.findAll({
        attributes: ['id', 'username']
    }).then(response => {
        console.log('response = ' + response);
        res.send(response);
    })
    .catch(err => console.log(err))
);

// Get get product by name or all products price ascending synchronous
router.get('/products', tokenValidation, (req, res, async=false, then) => {
    if (req.query.name){
        products.findOne({
            where: {
                title: req.query.name                          
            }
        }).then(response => {
            console.log('response = ' + response);
            res.send(response);
        })
        .catch(err => console.log(err))
    }
    else {
        products.findAll({
            order: [[ 'price', 'ASC']]
        }).then(response => {
            console.log('response = ' + response);
            res.send(response);
        })
        .catch(err => console.log(err))
    }
});

// Get get product by name or all products price ascending synchronous
router.get('/products/async', tokenValidation, (req, res, async=true, then) => {
    if (req.query.name){
        products.findOne({
            where: {
                title: req.query.name                          
            }
        }).then(response => {
            console.log('response = ' + response);
            res.send(response);
        })
        .catch(err => console.log(err))
    }
    else {
        products.findAll({
            order: [[ 'price', 'ASC']]
        }).then(response => {
            console.log('response = ' + response);
            res.send(response);
        })
        .catch(err => console.log(err))
    }
});

// Update product
router.put('/update_product', tokenValidation, (req, res, async=false, then) =>{
  
        let {id, title, price} = req.body
        let errors = [];
        // Validate fields
        if(!id){
            errors.push({ id: "Please add an id"});
        }
        if(!title){
            errors.push({ text: "Please add a title"});
        }
        if(!price){
            errors.push({ text: "Please add a price"});
        }
        // Check for errors
        if(errors.length > 0) {
            res.render('add', {
                errors,
                id,
                title,
                price
            })
        }
        else{
            // Update product
            products.update({
                title,
                price
            }, {where: { id: id }})
            .then(response => {
                console.log(response);
                res.redirect('/api/products?name=' + title);})
            .catch(err => console.log(err));
        }
});

// Validates the token provided in the requests header
function tokenValidation(req, res, async, next) {
    let authHeader = req.headers['authorization'];
    key = null;
    if (authHeader != undefined) {
        if (async = false) key = 'SECRET_KEY'
        else key = fs.readFileSync(path.join(__dirname, '../key/public_key.pem'), 'utf-8');

        let header = authHeader.split(' ');
        let token = header[1];
        jwt.verify(token, key, (err, result) => {
            if (err) {
                console.log(err);
                res.sendStatus(403);
            }
            else {
                next();
            }
        })
    }
    else {
        console.log('Header is not the correct type/format....');
        res.sendStatus(403);
    }
}

// Perform synchronous and asynchronous authentication 
function authenticateUser(username, pt_password, res, async){
    console.log('Authenticating user....')
    users.findOne({
        where: {
            username: username
        }
    }).then(function(user) {
        if(!user) {
            return res.status(401).json({
                message: "Authentication failed: Invalid user....",
            }, console.log('Authentication failed: Invalid user....'));
        }
        else {
            bcrypt.compare(pt_password, user.password, function (err, response) {
                if (response == true) {
                    let token = null;

                    if (async == true){
                        const privateKey = fs.readFileSync(path.join(__dirname, '../key/private_key.pem'), 'utf-8');

                        let payload = {
                            username: username,
                            id: user.id
                        };
                        let options = {
                            issuer: 'JamesWard',
                            audience: 'c12404762@mydit.ie',
                            subject: 'app_auth',
                            expiresIn: '12h',
                            algorithm: 'RS256'
                        };
                        token = jwt.sign(payload, privateKey, options);
                    }
                    else {
                        token = jwt.sign({
                            username,
                            id: user.id
                        }, 
                        'SECRET_KEY',
                        { expiresIn: '12h' });
                    }

                    return res.status(200).json({
                        message: 'Authentication successful....',
                        userid: user.id,
                        expiresIn: '12h',
                        token: token
                    });
                }

                console.log(response);
                return res.status(401).json({
                    message: 'Authentication failed....'
                });
            });
        }
    });
}

// Implementing HMAC authentication
router.get('/authenticate/hmac/products', validateHMAC, (req, res, then) => {
    
    if (!req.headers.id) {
        console.log('No parameters provided....');
        products.findAll().then(response => {
            res.writeHead(200);
            res.write(
                JSON.stringify({
                    products: response
                })
            );
            res.write(
                JSON.stringify({
                    access_key: req.headers.accessid
                })
            );
            res.send();
        })
        .catch(err => {
            console.log(err);
            res.send(401);
        });
    }
    else {
        console.log('Parameters provided....');
        let id = req.headers.id;

        products.findOne({
            where: {
                id: id
            }
        }).then(response => {
            res.append('accessid', req.headers.accessid);
            res.writeHead(200);
            res.write(
                JSON.stringify({products: response})
            );
            res.write(
                JSON.stringify({
                    params: '?id=' + req.headers.id
                })
            );
            res.send();
        })
    }
});

// Validate HMAC credentials
let validateHMACCredentials = function (requestAccessKeyId) {
    return {
        accessKeyId: requestAccessKeyId,
        accessKeySecret: '_F-JaNdRgUkXp2s5v8x_r4u7xyA5DXG-KaPdSgUk'              
    };
};

function validateHMAC(req, res, next) {
    console.log(res)
    if (hmac.validateHttpRequest(req, validateHMACCredentials)) {
        next();
    } else {
        console.log('Authentication error, HMAC credentials do not match.....');
        response.writeHead(401);
        response.end('Invalid Credentials!');
    }
}

module.exports = router;