const express = require('express'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    app = express(),
    crypto = require('crypto'),
    secret = 'asdfgh123456' //this should be secured but for demo purposes ill store it here

app.use(bodyParser.json());

require('massive')({ host: '127.0.0.1',  port: 5432, database: 'pgguide', user: 'postgres', password: '1234566' })
    .then(massiveInstance => app.set("db", massiveInstance))

app.post('/register', async function (req, res) {
    if (!req.body.username || !req.body.password) return  res.send('Please provide a user and password');
    const public_key = await crypto.randomBytes(20).toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
    const secret_key = await crypto.randomBytes(40).toString('base64').replace(/\//g,'_').replace(/\+/g,'-');

    await req.app.get('db').query("INSERT INTO account (public_key, secret_key, username, password) " +
        "VALUES ('" + public_key + "', '" + secret_key + "', '" + req.body.username + "', crypt('" + req.body.password + "', gen_salt('md5')));")

    res.send('registered')
})

//also sending public and secret key associated with account just to use for next parts
//secret key should not be shared like this, only doing it like this for lab purposes
app.post('/login', async (req, res) => {
    if (!req.body.username || !req.body.password) return res.send('Please provide a user and password');

    const result = await req.app.get('db').query("SELECT public_key, secret_key, password = crypt('" + req.body.password + "', password) " +
        "FROM account WHERE username='" + req.body.username + "';")

    if (result[0]['?column?'] !== true) return  res.send('invalid login');

    res.send({
        token: jwt.sign({
            username: req.body.username,
        }, secret, { expiresIn: '24h' }),
        message: 'Logged in succesfully',
        public_key: result[0].public_key,
        secret_key: result[0].secret_key
    })
})

app.get('/products/jwt',async  (req, res) => {
    if (!req.headers._token) return res.status(401).send("No token provided")

    jwt.verify(req.headers._token, secret, async (err, decoded) => {
        if (err) return res.status(401).send(err)
        if (!decoded) return res.status(401).send("Invalid token")
        res.status(200).send(await req.app.get("db").query("select * from products where title= '" + req.body.title + "'"))
    })
})

app.get('/products/hmac', async (req, res) => {
    if (!req.headers.signature) return res.status(401).send("No signature provided")
    if (!req.headers.public_key) return res.status(401).send("No public key provided")

    //get the secrey_key based on the public_key provided
    const result = await req.app.get('db').query("select secret_key from account WHERE public_key='" + req.headers.public_key+ "'")
    if  (result.length === 0) return res.status(401).send("Invalid")

    //generate new hash with the secret key and body data, if hash matches signature provided then all good
    if (req.headers.signature === crypto.createHmac('sha256', result[0].secret_key).update(req.body.title).digest('hex')){
        res.status(200).send(await req.app.get("db").query("select * from products where title= '" + req.body.title + "'"))

    }else res.status(401).send("Unauthenticated")
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})