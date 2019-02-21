/////////// IMPORTS /////////////////////////////
const express = require('express');
const router = express.Router();
const path = require("path"); // used for finding pu pr keys

//MODELS
const usersObj = require('../models/users');
const Users = usersObj.get('Users');

const productsObj = require('../models/products');
const Products = productsObj.get('Products');

//JWT
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const methods = require('./methods');

//file reading
const fs = require("fs");



//For Posting
var bodyParser = require('body-parser')
router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

///////////// Functions /////////////////////////////////////
function authenticate(username, password_clear, res, async) {
    console.log('--------in authenticate---------');

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
                    //generate token
                    var opts = {};
                    opts.expiresIn = '1h';  //token expires in 1minute   - 1h  , 1 day , 120ms
                 
                    const secret = "SECRET_KEY";
                    var token = null;

                    if(async == true){
                        
                        console.log('------- using ASYNC ALGO---------')

                        // read in the public private keys. NOTE: THESE ARE ONLY TEST KEYS. They will never be used again
            
                        const privateKey = fs.readFileSync(path.join(__dirname, '../private.key.pem'),"utf-8");
                      
                        var payload = {username:username, id:user.id};
                        var options = {
                            issuer: "ericstrong",
                            audience: "ericstrong@eric.com",
                            subject: "some website",
                            expiresIn: '1h',
                            algorithm : "RS256"
                        };
                        token = jwt.sign(payload, privateKey, options)
                    
                    }else{
                        console.log('------- using SYNC ALGO---------')
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


///////////////////// ENDPOINTS //////////////////////////
// main endpoint to return home page
router.get('/', (req, res, next) => {
    res.render('home', {title:'Authentication works!'});
});

// problem set 1 - return /users and /products
router.get('/users', (req, res, next) => {

    Users.findAll().then(users => {
        res.send({
            status: 200,
            users
        });
    }).catch(err => {
        console.log(err)
        res.send(401);
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


//problem set 2.1 - using JWT
router.post('/authenticated/login', (req, res) => {
    console.log('--------in endpoint---------');
    const username = req.body.username;
    const password_clear = req.body.password;
    authenticate(username, password_clear, res, async=false);
});


//problemset 2.2 - using ensureToken to verify the Token
router.get("/protected", methods.validateToken, (req, res, next) => {
    res.send({
        status: 200,
        message: "Token has been Verified!",
        token: req.headers["authorization"]
    });
   });//end response



// problem set 2.3 using token and verification - return /users and /products
router.get('/protected/users',methods.validateToken, (req, res, next) => {

    Users.findAll().then(users => {
        res.send({
            status: 200,
            users
        });
    }).catch(err => {
        console.log(err)
        res.send(401);
    });
});

router.get('/protected/products',methods.validateToken, (req, res, next) => {

    Products.findAll().then(products => {
        res.send({
            status: 200,
            products
        });
    }).catch(err => {
        console.log(err)
        res.send(401);
    });
});


//problem set 2.4 - using a process.env.PASSWORD;
router.post('/authenticated/loginstoredpassword', (req, res) => {
    console.log('--------in endpoint---------');
    const username = req.body.username;
    const password_clear = process.env.EADPASSWORD;
    console.log('env password:' + process.env.EADPASSWORD)
    authenticate(username, password_clear, res,async=false);
});


//problem set 2.5 using asynchronous algorithms : in the jwt.sign  { algorithms: ['RS256'] }
router.post('/authenticated/loginasync', (req, res) => {
    console.log('--------in endpoint---------');
    const username = req.body.username;
    const password_clear = process.env.EADPASSWORD;
    console.log('env password:' + process.env.EADPASSWORD)
    authenticate(username, password_clear, res, async=true);
});


//verify the async token 2.5
router.get("/protectedasync", methods.validateTokenAsync, (req, res, next) => {
    res.send({
        status: 200,
        message: "AsyncToken has been Verified!",
        token: req.headers["authorization"]
    });
   });//end response


//get protected resource with the Async algo
router.get('/protectedasync/products',methods.validateTokenAsync, (req, res, next) => {

    Products.findAll().then(products => {
        res.send({
            status: 200,
            products
        });
    }).catch(err => {
        console.log(err)
        res.send(401);
    });
});

//get protected resource with the Async algo
router.get('/protectedasync/users',methods.validateTokenAsync, (req, res, next) => {

    Users.findAll().then(users => {
        res.send({
            status: 200,
            users
        });
    }).catch(err => {
        console.log(err)
        res.send(401);
    });
});



//passing a token via param - NOT IMPORTANT - JUST PLAYING AROUND WITH PASSING TOKENS VIA URL in BROWSER
//http://localhost:3000/param/protected/products?token=x
// router.get('/param/protected/products', (req, res, next) => {
//     if(req.query.token){
//         console.log(req.query.token);

//         jwt.verify(req.query.token, 'SECRET_KEY', (err, result) => {
//             if (err) {
//                 console.log(err);
//                 res.sendStatus(403)
//             } else {
//                 Products.findAll().then(products => {
//                     res.send({
//                         status: 200,
//                         products
//                     });
//                 }).catch(err => {
//                     console.log(err)
//                     res.send(401);
//                 });
               
//             }
//         })
//     }else{
//         console.log('error');
//             res.sendStatus(403)
//         }
//     }
  
// );





//exporting the router module so it can be imported
module.exports = router
