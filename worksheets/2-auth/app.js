const express = require('express')
const massive = require('massive')
const bodyParser = require('body-parser')
const jwt  = require('jsonwebtoken')
const crypto = require('crypto')

const app = express()
const port = 5005
const secret = 'V%*VY&CTV**^WDBTAVDOVABDGYA'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function generateToken(req, userId) {
    return jwt.sign({
        auth: userId,
        exp: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60,
    }, secret)
}

function isValidToken(token, userId) {
    try {
        var decoded = jwt.verify(token, secret)
    } catch (e) {
        return false
    }

    if(!decoded || decoded.auth != userId) {
        return false
    } else {
        return true
    }
}

massive({
    host: 'localhost',
    port: 5432,
    database: 'authdb',
    user: 'postgres',
    password: 'toor',
    ssl: false,
}).then(db => {
    app.post('/signup', async function (req, res) {
        const publicKey = await crypto.randomBytes(20).toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
        const secretKey = await crypto.randomBytes(40).toString('base64').replace(/\//g,'_').replace(/\+/g,'-');

        const result = await db.query('select user_id from users order by user_id desc limit 1;')
        const lastUserId = result[0].user_id

        await db.query('INSERT INTO users (username, password_hash, user_id, public_key, secret_key)' +
            'VALUES (${username}, crypt(${password}, gen_salt(\'md5\')), ${userId}, ${publicKey}, ${secretKey});', {
            username: req.body.username,
            password: req.body.password,
            publicKey,
            secretKey,
            userId: lastUserId + 1,
        })
    
        res.json(await db.users.findOne({ username: req.body.username }))
    })

    app.get('/login', async (req, res) => {
        const { username, password } = req.query
        const user = await db.users.findOne({ username })
        const userId = user && user.user_id

        if (!userId) {
            res.statusCode = 401
            res.send('Invalid Login')
        }

        const result = await db.query('select password_hash = crypt(${password}, password_hash) as valid from users where user_id = ${userId};', { password, userId })
        const isValidLogin = result[0].valid

        if (!isValidLogin) {
            res.statusCode = 401
            res.send('Invalid Login')
        }

        const token = generateToken(req, userId)
        res.json({ token })
    })

    app.get('/products', async (req, res) => {
        const token = req.headers.authorization
        const userId = req.query.userId

        if (!isValidToken(token, userId)) {
            res.statusCode = 401
            res.send('Not authenticated.')
        } else {
            res.json(await db.products.find({}))
        }
    })

    app.put('/products/product', async (req, res) => {
        const token = req.headers.authorization
        const userId = req.query.userId
        const newProduct = await req.body

        if (!isValidToken(token, userId)) {
            res.statusCode = 401
            res.send('Not authenticated.')
        } else {
            const result = await db.products.insert(newProduct)
            res.json(result)
        }
    })

    app.get('/signature', async (req, res) => {
        // Generate new hash with the secret key and query
        const user = await db.users.findOne({ username: req.query.username })
        const secretKey = user.secret_key

        const signature = crypto.createHmac('sha256', secretKey)
            .update(req.query.name)
            .digest('hex')
        res.json({ signature })
    })

    app.get('/products/hmac', async (req, res) => {
        const result = await db.users.find({
            public_key: req.headers.public_key,
        })

        if (result.length === 0) {
            res.statusCode = 401
            return res.send("Invalid authentication.")
        }

        // Generate new hash with the secret key and query
        const secretKey = result[0].secret_key
        const newHash = crypto.createHmac('sha256', secretKey)
            .update(req.query.name)
            .digest('hex')

        if (req.headers.signature !== newHash) {
            res.statusCode = 401
            res.send('Not authenticated.')
        }

        res.json(await db.products.find({
            name: req.query.name,
        }))
    })

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})