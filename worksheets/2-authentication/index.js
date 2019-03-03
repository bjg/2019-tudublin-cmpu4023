
const express = require('express');
const app = express();
const port = 3000;
const Seq = require('sequelize');
var model = require('./server/models/users');
var bcrypt = require('bcrypt');
const crypto = require('crypto');
const saltRounds = 10;
var con = require('./server/config');

const jwt = require("jsonwebtoken");

app.post('/users/create', function (req, res) {
    bcrypt.hash(req.body.passwordsignup, saltRounds, function (err, hash) {
        model.Users.create({
            username: req.body.usernamesignup,
            password: hash
        }).then(function (data) {
            if (data) {
                let token = getToken(req,data);
                res.status(200).json({status: res.statusCode, payload: token});
            }
        });
    });
});

function getToken(req, data){

    var user = {username:username, id:user.id};
    var options = {
        auth: "ap",
        audience: "ap@ap.com",
        subject: "data",
        expire: '24hr'
    };
    return jwt.sign(user, options, data);
}


app.post('/users', function (req, res) {
    model.User.findOne({
        where: {
            usernmae: req.body.username
        }
    }).then(function (user) {
        if (!user) {
            res.redirect('/');
        } else {
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result == true) {
                    res.send('Success');
                    res.sendStatus(200);
                } else {
                    res.send('Incorrect password');
                    res.sendStatus(403);
                }
            });
        }
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secret_key', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
});

app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        username: 'apeng',
        email: 'apeng@gmail.com'
    }

    jwt.sign({user}, 'secret_key', { expiresIn: '24 hrs' }, (err, token) => {
        res.json({
            token
        });
    });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        // Forbidden
        res.sendStatus(401);
    }

}

////HMAC //////

app.post('/hmac', (req, res) => {

    const headerAuth = req.headers.authorization;

    const sig = req.body.accesskey + req.body.message;
    console.log(message);


    const hash = crypto.createHmac('sha256', 'password123');

    hash.update(sig);

    const hashed = hash.digest('hex');

    console.log(hashed);

    if(headerAuth == hashed){
        //res.sendStatus(200);
        return res.status(200).json({
            "mesage": "same hash"
        });


    }else{
        // Forbidden
        //res.sendStatus(401);
        return res.status(401).json({
            "message": " not hashed"
        });
    }
});


app.listen(port, () => console.log('Server started on port 3000'));
module.exports = app;


//
// -----BEGIN RSA PRIVATE KEY-----
//     MIIBOgIBAAJBAL00LUapoIE5VH9qsBh3zPL60SQqaZ/rtPgDdVQ60HnXSA2IAoRN
// fKiBwDBmLC45UIzmjzBKbz5N25zQeuTctXsCAwEAAQJAQCDgO7Qgv8vztOAvYYux
// fqW+n1h0xox4oRti+DKbGMBm7NhSXB5N7J4FndZAYEYjnVSQMPGJz2O92YkclnfF
// qQIhAN2WIOSm7BrsAQHhFZgfonbG+UuvuoPyGNM2ZlPoNpsHAiEA2paTEd+5StZm
// U248veLKBaGNc8Aot7DHD4H1ltb7UO0CIQCyb93nI0BIYbph8Aa6rObgbVR9jXJO
// JJu3Ijx+3yVx6wIgfrx6/QwINNnmbk0mLrqFg4pNp2UstoRqhhVFvXVcNWkCICV/
// Xv82DMPJg/4hk0Q0hYxFGsr2msWbewzNthWXcFuj
// -----END RSA PRIVATE KEY-----
//
// -----BEGIN PUBLIC KEY-----
//     MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAL00LUapoIE5VH9qsBh3zPL60SQqaZ/r
// tPgDdVQ60HnXSA2IAoRNfKiBwDBmLC45UIzmjzBKbz5N25zQeuTctXsCAwEAAQ==
// -----END PUBLIC KEY-----