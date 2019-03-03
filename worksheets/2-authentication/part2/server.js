/*
    Part 2
*/

const express = require('express')
const massive = require('massive')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const port = 3000

massive({
    host: 'localhost',
    port: 5432,
    database: 'lab02',
    user: 'postgres',
    password: 'pass',
    ssl: false,
    poolSize: 10
}).then(instance => {
    app.set('db', instance)

    app.use(bodyParser.urlencoded({
    extended: true
    }))

    app.use(bodyParser.json())

    app.post('/login', login);

    // demonstration on protected resource products table
    app.post('/products', verifyToken, async (req, res) => {
        const db = req.app.get('db')
        res.send(await db.query('select * from products'))
    })

    app.listen(port, () => console.log(`App is listening on port ${port}!`))
})


async function login (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    const db = req.app.get('db')
    if (username && password) {
        try {
            auth_query = 'select id, password = crypt($2, password) as result from users where username = $1'
            authenticate = await db.query(auth_query, [username, password])
            if(authenticate.length && authenticate[0].result) {
                var privateKey  = fs.readFileSync('./private.key', 'utf8')
                jwt.sign({userId: authenticate[0].id}, privateKey,
                    {expiresIn: '24h', algorithm: 'RS256'}, (err, token) => {
                    if(err)
                        console.log(err)
                    res.send(token)
                })
            } else {
                res.statusCode = 401
                res.send('Incorrect username or password')
            }
        } catch(err) {
            console.log(err)
        }
    } else {
        res.statusCode = 401
        res.send('Authentication failed! Please check the request')
    }
}

let verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']

    if(token) {
        if(token.startsWith('Bearer '))
            token = token.slice(7, token.length) // slice after "Bearer"
        var publicKey  = fs.readFileSync('./public.key', 'utf8')
        jwt.verify(token, publicKey, (err, decoded) => {
            if(err) {
                res.statusCode = 401
                res.send('Token is not valid')
            } else {
                req.decoded = decoded
                next()
            }
        })
    } else {
        res.statusCode = 401
        return res.send('Auth token is not supplied')
    }
}