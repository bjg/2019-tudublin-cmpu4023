//Daniel Vegera C15469578

const express = require('express');
const massive = require('massive');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const crypto = require('crypto');

const port = 3001;
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/*
--Create new user table
CREATE TABLE public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    password character varying(255),
    username character varying(255),
    access_key character varying(255),
    secret_key character varying(255),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
*/

massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'pgguide',
    user: 'Dano',
    password: '123'
}).then(instance => {
    app.set('db', instance);

    app.get('/test', (req, res) => {
        req.app.get('db').query("select * from users")
            .then(data =>{
                res.send(data);
            });
    });

    let secret_key = crypto.randomBytes(40);//320 bits
    //Create a new user in the user table with hashed password and a random byte access key and private key
    //http://localhost:3000/register?user=dano2&password=pass
    app.post('/register', (req, res) => {
        if(req.body.user && req.body.password != null) {

            let access_key = crypto.randomBytes(20);//160 bits
            let query = "INSERT INTO users (username, password, access_key, secret_key)" +
            "VALUES ($1 ,crypt($2 ,gen_salt('md5')), $4, $5);";

            req.app.get('db').query(query, [req.body.user, req.body.password, access_key.toString('hex'), secret_key.toString('hex')])
                .then(data =>{
                    if(data) {
                        res.send("User added successfully!");
                    }
                    else {
                        res.send("Error");
                    }
            });
        }
        else {
            res.send("User details not provided!");

        }
    });

    //Login as a previously created user, with password decrypting to check if user password matches
    //http://localhost:3000/login?user=dano2&password=pass
    app.get('/login', (req, res) => {
        if(req.query.user && req.query.password) {
            let query = "SELECT username FROM users WHERE username= $1 AND password = crypt($2, password);";

            req.app.get('db').query(query, [req.query.user, req.query.password])
                .then(data =>{

                if(data.length>0) {
                    let username = data[0]['username'];
                    if(username===req.query.user)
                    {
                        res.send("User:"+username+", logged in successfully!");
                    }
                }
                else {
                    res.send("Incorrect details");
                }
            });
        }
        else {
            res.send("User details not provided!");

        }
    });


    let secretKey = "Token";

    //Create a token for a logged in user
    //http://localhost:3000/jwtlogin?user=dano2&password=pass
    app.get('/jwtlogin', (req, res) => {
        if(req.query.user && req.query.password) {
            let query = "SELECT id,username FROM users WHERE username= $1 AND password = crypt($2, password);";

            req.app.get('db').query(query, [req.query.user, req.query.password])
                .then(data =>{
                    let id = data[0]['id'];
                    let username = data[0]['username'];

                    if(id!=null) {
                        jwt.sign({id: id, username: username}, secretKey, {expiresIn: '24h'}, function(err,token){
                            res.send("User: "+ username +" with ID: "+ id +", logged in.\n" + token);
                        });
                    }
                    else {
                        res.send("Nothing received");
                    }
                });
        }
        else {
            res.send("User details not provided!");

        }
    });

    //Authenticate a token to see what user owns it
    //http://localhost:3000/jwtauth?user=dano2&password=pass&token=
    app.get('/jwtauth', (req, res) => {
        if(req.query.user && req.query.password && req.query.token) {

            let token = jwt.verify(req.query.token, secret);
            if(token.username === req.query.user)
            {
                //let user make api calls here
                res.send("Authenticated");
            }
            else
            {
                res.send("Not authenticated");
            }
        }
        else
        {
            res.send("Incorrect details");
        }

    });
    //http://localhost:3000/hmac?access_key=2ee18cc6179a5395437d5016b7d8183e1f5fb713
    //let hmac = crypto.createHmac()
    app.get('/hmac', (req, res) => {
        if(req.query.access_key)
        {
            let query = "SELECT secret_key FROM users WHERE access_key=$1";
            req.app.get('db').query(query, [req.query.access_key])
                .then(data =>{
                    let secretKey = data[0]['secret_key'];
                    res.send("Secret Key: "+secretKey);
                });


        }
    });

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});