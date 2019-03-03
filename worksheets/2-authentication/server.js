const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const randomkey =require('random-key-generator');
const url = require('url')

const sequelize = require('./database/sequelize')

const PORT = 3000;

const app = express();

let jsonParser = bodyParser.json();

const secret = randomkey.getRandom(10)

app.use(jsonParser);

let verifyToken = (req, res, next) => {

    const bearerHeader = req.headers['authorization']

    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(401);
    }
}

let getProducts = (category) => {
    return new Promise((resolve, reject) => {
        if(category){
            sequelize.query("SELECT * FROM PRODUCTS WHERE category = ?",
            {replacements: [category]})
                .then(products => resolve(products))
                .catch(err => reject(err));
        }else{
            sequelize.query("SELECT * FROM PRODUCTS")
                .then(products => resolve(products))
                .catch(err => reject(err));
        }
    })
}

let getProduct = (name, category, cost) => {
    return new Promise((resolve, reject) => {
        sequelize.query("SELECT * FROM PRODUCTS WHERE name = ? AND category = ? AND cost = ?",
        {replacements: [name, category, cost]})
            .then(product => resolve(product[0]))
            .catch(err => reject(err))
    })
}

let postProduct = (body) => {
    return new Promise((resolve, reject) => {
        if(body){
            sequelize.query("INSERT INTO PRODUCTS (name, category, cost) VALUES (?, ?, ?)",
            {replacements: [body.name, body.category, body.cost]})
                .then(okCode => resolve(okCode))
                .catch(err => reject(err))
        }
    })
}

let getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        sequelize.query("SELECT * FROM USERS WHERE username = ? AND password = crypt(?, password)",
            {replacements: [username, password]}
        ).then(user => resolve(user))
        .catch(err => reject(err))
    })
}

let updateKeys = (accesskey, secretkey, id) => {
    return new Promise((resolve, reject) => {
        sequelize.query("UPDATE users SET accesskey = ? , secretkey = ? WHERE id = ?", 
        {replacements: [accesskey, secretkey, id]})
            .then(updatecode => resolve(updatecode))
            .catch(err => reject(err))
    })
}

/* question 1.1, find out what this means 
    "Implement a protected resource table (e.g. a “products” table) to which you can
     use to demonstrate your authentication features" 
*/

app.post('/register', (req, res) => {
    sequelize.query("INSERT INTO USERS (username, password, created_at) VALUES (?, crypt(?, gen_salt('md5')), NOW())",
        {replacements: [req.body.username, req.body.password]}
    ).then(okCode => res.sendStatus(201))
     .error(err => res.status(403).send(err));
});

app.post('/login', (req, res) => {
    sequelize.query("SELECT * FROM USERS WHERE username = ? AND password = crypt(?, password)",
        {replacements: [req.body.username, req.body.password]}
    ).then(user => {
        if(!user[0].length){
            res.sendStatus(401);
        }else{      
            jwt.sign({user: user[0]}, secret, {expiresIn: '1h'}, (err, token) => {
                getUser(req.body.username, req.body.password)
                    .then((user) => {

                        if(req.header("Prime") && req.header("Generator") && req.header("Key")){
                            const server = crypto.createDiffieHellman(req.header("Prime"), 'base64', req.header("Generator"), 'base64');
                            const server_key = server.generateKeys();
                            const server_secret = server.computeSecret(req.header("Key"), 'base64');
                            
                            const accesskey = server_key.toString('base64').slice(0,28);
                            const secretkey = server_secret.toString('base64');

                            updateKeys(accesskey, secretkey, user[0][0].id)
                                .then(code => {

                                    res.status(200).json({
                                        token:token,
                                        user:user[0],
                                        server_key: server_key.toString('base64'),
                                        server_secret: server_secret.toString('base64'),
                                    })
                                })
                                .catch(err => res.sendStatus(403))

                        }else{
                            res.status(200).json({
                                token:token,
                                user:user[0]
                            })
                        }


                    }).catch(err => res.status(403).send(err))
            });
        } 
    })
     .catch(err => res.send(err));
});

app.get('/products', verifyToken, (req, res) => {
    jwt.verify(req.token, secret, (err, authData) => {
        if(err){
            res.sendStatus(401);
        }else{
            getProducts(req.query.category)
                .then(products => {
                    if(products[0] == []){
                        res.sendStatus(204);
                    }else{
                        res.status(200).send(products[0])
                    }
                })
                .catch(err => res.send(err))
        }
    });
});

app.post('/products', verifyToken, (req, res) => {

    jwt.verify(req.token, secret, (err, authData) => {
        if(err){
            res.sendStatus(401);
        }else{
            postProduct(req.body)
                .then((okCode) => {
                    getProduct(req.body.name, req.body.category, req.body.cost)
                        .then(product => res.status(200).send(product))
                        .catch(err => res.sendStatus(403))
                }).catch(err => res.sendStatus(403))
        }
    });
})

/* question 4 start block */

// 4a (message body)

app.post('/products_hmac', verifyToken, (req, res) => {
    jwt.verify(req.token, secret, (err, authData) => {
        if(err){
            res.sendStatus(401);
        }else{
            if(req.header("AccessKey")){
                sequelize.query("SELECT * FROM USERS WHERE accesskey = ? AND id = ?",
                {replacements: [req.header("AccessKey"), authData.user[0].id]})
                    .then(user => {
                        if(user){
                            const clientSignature = req.header('ClientSignature');
                            const serverSecret = req.header('ServerSecret');
                            
                            const BODY = req.body;
                            const BODYSTRINGIFIED = JSON.stringify(BODY);

                            let signature = crypto.createHmac('md5', serverSecret)
                                                    .update(BODYSTRINGIFIED + req.header('AccessKey'))
                                                    .digest('base64');

                            if(signature == clientSignature){
                                postProduct(req.body)
                                .then((okCode) => {
                                    getProduct(req.body.name, req.body.category, req.body.cost)
                                        .then(product => res.status(200).send(product))
                                        .catch(err => res.sendStatus(403))
                                }).catch(err => res.sendStatus(403))
                            }
                            
                        }else{
                            res.sendStatus(401);
                        }
                    }).catch(err => res.status(403).send(err))
            }
        }
    });
})

// 4c (query parameters)

app.get('/products_hmac', verifyToken, (req, res) => {
    jwt.verify(req.token, secret, (err, authData) => {
        if(err){
            res.sendStatus(401);
        }else{
            if(req.header("AccessKey")){
                sequelize.query("SELECT * FROM USERS WHERE accesskey = ? AND id = ?",
                {replacements: [req.header("AccessKey"), authData.user[0].id]})
                    .then(user => {
                        if(user){
                            const clientSignature = req.header('ClientSignature');
                            const serverSecret = req.header('ServerSecret');
                            
                            let parsedUrl = url.parse(req.url);
                            let splitQuery = parsedUrl.query.split("=")
                            let category = splitQuery[1]

                            let signature = crypto.createHmac('md5', serverSecret)
                                                    .update(parsedUrl.query + req.header('AccessKey'))
                                                    .digest('base64');

                            if(signature == clientSignature){
                                getProducts(category)
                                .then(products => {
                                    if(products[0] == []){
                                        res.sendStatus(204);
                                    }else{
                                        res.status(200).send(products[0])
                                    }
                                })
                                .catch(err => res.status(403).send(err))
                            }
                        }else{
                            res.sendStatus(401);
                        }
                    }).catch(err => res.status(403).send(err))
            }
        }
    });
})

/* question 4 end block */

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
