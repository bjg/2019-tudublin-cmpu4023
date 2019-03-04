// node imports
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const decode = require('jwt-claims');
const crypto = require('crypto');
const bp = require('body-parser')
const massive = require('massive')
const monitor = require('pg-monitor')


// connection string
/*
massive({
    host: 'localhost',
    port: 5432,
    database: 'c15346551',
    user: 'aodhan',
    password: 'aodhan'
  }).then(instance => { db => {
    monitor.attach(db.driverConfig);
*/

//app.use(bp.json())

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);

        }else{
            res.json({
                message: 'post created',
                authData
            });
        }
    });
})

app.post('/api/login', (req, res) => {
    //mock user for testing
    const user ={
        id: 1,
        username: 'c15346551'
    }
    jwt.sign({user}, 'secretkey', { expiresIn: '24h' }, (err,token) =>{
        res.json({
            token
        });
    });
});

// format of token
//Authorization: Bearer <access_token>

// verify token
function verifyToken(req, res, next){
    // get the auth header value
    const bearerHeader = req.headers['authorization'];
    // check of bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        // split token by a space and turn it into an array
        const bearer = bearerHeader.split(' ');
        // get token
        const bearerToken = bearer[1];
        // set the toke
        req.token = bearerToken;
        //  next middlewear
        next();

    }else{
        // Send forbidden status
        res.sendStatus(403);
    }
}

app.listen(5000, () => console.log('server has started on port 5000'));
    //};
//});