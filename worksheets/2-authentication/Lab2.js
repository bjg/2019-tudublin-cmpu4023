const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

app = express()
app.use(bodyParser.json());

require('massive')({
    host: '127.0.0.1',
    port: 5432,
    database: 'pgguide',
    user: 'postgres',
    password: '123456'})
    .then(instance => app.set("db", instance))

const secret_key = 'C`JeXx(pYAnSpQ=SL7$z#)xLUk)-rk00RWf+q7_)'
const access_key = '8jYjX#:Ni*-07@?V|IzA'

app.post('/register', async (req, res) => {
    const user_id = req.body.user_id
    const username = req.body.username
    const password = req.body.password

    if(!username || !password){
        return res.send('No username or password provided');
    }

    res.send(await req.app.get("db").query("INSERT INTO accounts (user_id, username, password) values (" + user_id + ",'" + username + "' ,crypt('" + password +"', gen_salt('md5')));"))
    console.log('Inserted')
})

app.post('/login', async (req, res) => {
    const userExists = await req.app.get("db").query('select * from accounts where username = ${username};', { username: req.query.username })
    const passwordMatch = await req.app.get("db").query('select * from accounts where password = ${password};', { password: req.query.password })

    if (!userExists) {
        res.status(401).send({
            success: false,
            message: 'User Does Not Exist'
        })
        return
    }

    if (!passwordMatch) {
        res.status(401).send({
            success: false,
            message: 'Incorrect Password'
        })
        return
    }

    var token = jwt.sign({ username: req.query.username }, process.env.SECRET_OR_KEY);

    res.status(200).send({
        success: true,
        message: 'Token Created',
        token: token
    })
})

app.post('/updateUser', async (req, res) => {
    res.send(await req.app.get("db").query("UPDATE accounts SET secret_key = '" + secret_key + "', access_key = '" + access_key + "' WHERE user_id = 1;"))
})

app.get('/protected', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_OR_KEY, function(err, data) {
        if (err) {
            res.sendStatus(401);
        } else {
            res.json({
                description: 'Protected information.',
                data: data
            });
        }
    });
})

function ensureToken(req, res, next){
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(401);
    }
}

app.post('/update', async (req, res) => {
    if (!req.body.token) {
        res.send({
            success: false,
            message: "Invalid token"
        })
    }

    const decoded = jwt.verify(req.body.token, process.env.SECRET_OR_KEY)

    if(!decoded){
        res.send({
            success: false,
            message: "Invalid token"
        })
    }

    const user_id = req.body.user_id

    await req.app.get("db").query('UPDATE accounts ' +
        'SET username = "user4" ' +
        'WHERE user_id = ${user_id};', { user_id: user_id})

    res.send({
        success: true,
        message: "Updated"
    })
})

function hash(key, msg) {
    var hmac = crypto.createHmac('sha256', access_key);
    hmac.update(secret_key);
    return hmac.digest();
}

let signature = hash(secret_key, [access_key])
console.log(signature)

function ensureHmac(req, res, next) {
    const reqAccessKey = req.headers.accessKey;
    const reqSignature = req.headers.signature;

    req.app.get("db").query("SELECT secret_key from accounts where access_key='" + reqAccessKey + "';")
        .then(data => {
            if(!data){
                return res.status(401).send("Error")
            }

            const userKey = data[0].secret_key;

            let signature = hash(userKey, [access_key])

            if (reqSignature === signature) {
                next()
            } else {
                return res.status(401).send('Unauthenticated')
            }

        }).catch((error) => {
        res.json(error);
        console.log(error, 'Error');
    });
}

app.get('/authAPI', ensureHmac, async (req, res) => {
    await req.app.get("db").query('' +
        'select * from products ' +
        'WHERE id=' + req.params.id + ' ' +
        'ORDER BY created_at')

    res.send({
        success: true,
        message: "Updated"
    })
})

app.listen("3000" ||process.env.PORT,()=>{
    console.log('Done.')
})