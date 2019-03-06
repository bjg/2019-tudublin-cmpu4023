/*
Name: Aodhan Brown
Student number: C15346551
Lab2
*/


// node imports
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const decode = require('jwt-claims');
const crypto = require('crypto');
const bp = require('body-parser')
const massive = require('massive')
const monitor = require('pg-monitor')

app.use(bp.json())

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
        username: 'c15346551',
        password: '$2a$06$xoI.he3ymnFljF4.k8e9.ODI0U6OXn/fV1zaFCIy5qIpR555e6Ida'
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


// HMAC

app.get('/api/select_user', (req, res) => {

    //mock user for testing
    const user ={
        id: 1,
        username: 'c15346551',
        password: '$2a$06$xoI.he3ymnFljF4.k8e9.ODI0U6OXn/fV1zaFCIy5qIpR555e6Ida',
        u_secretkey: 'L76RN91LTS98RA47H3ILWL3NWW62RQC5S57U1KDU6V5DH7GGTX4ZZMS8Y2WR7IOSM3I3DSXA2QU9YTPI',
        u_accesskey: '69LS8SQUXS7KTFLA7MS2PJY2RWC51D7VF3WDCDGF'
    }

    const request_HMAC = req.headers.authorization
    const accesskey = req.body.accesskey
    const username  = req.body.username
    const messagebody = accesskey + username
    
    if(user.username == username){

        const HMAC = crypto.createHmac('sha256', user.u_secretkey)
        HMAC.update(messagebody)
        const true_HMAC = HMAC.digest('hex')

        if(true_HMAC == request_HMAC){
            res.json({
                user,
                message: 'Autherization successful'
            });
        }else{
            res.sendStatus(403);
        }

    }else{
        res.sendStatus(401);
    }
    
});

app.listen(5000, () => console.log('server has started on port 5000'));
    //};
//});