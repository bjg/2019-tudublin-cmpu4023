const express = require('express');
const massive = require('massive');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 3002;
app.use(bodyParser.json());
var db;

//Connection to the Postgress database
massive({
    host: 'localhost',
    port: 5432,
    database: 'lab2',
    user: 'usr',
    password: 'password'
}).then((ddb) => {
    db = ddb
});

app.get('/api', function (req, res) {
    res.json({
        text: "Hello World"
    })
})

/**
 * GET Products endpoint which calls checkHmac first beofre returning the information.
 */
app.get('/products', checkHmac, function (req, res) {

    db.products.find({}, {}).then(products =>

            res.status(200).json(products))

        .catch((error) => {
            res.json(error);
            console.log(error, 'Promise error');
        });
})

/**
 * POST Products endpoint which calls checkHmac first beofre returning the information.
 */
app.post('/products', checkHmac, function (req, res) {

    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;

    db.products.insert({
        productid: id,
        name: name,
        price: price
    }).then(result =>
        res.status(200).json(result)

    ).catch((error) => {
        res.json(error);
        console.log(error, 'Promise error');
    });

})

/**
 * PUT Products endpoint which calls checkHmac first beofre returning the information.
 */
app.put('/products/:id', checkHmac, function (req, res) {

    const id = req.params.id;
    const productName = req.body.name;
    const price = req.body.price;

    db.products.update({
        productid: id
    }, {
        name: productName,
        price: price

    }).then(result =>
        res.status(200).json(result)

    ).catch((error) => {
        res.json(error);
        console.log(error, 'Promise error');
    });
})

//The REST server will listen at port 3002 for incoming requests
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

/**
 * 
 * @param {req} user's request information  
 * @param {res} used if the function needs to send a response to the user
 * @param {nex} used to carry on woth the call if the token is valid
 * 
 * The user's secret key is retrieved from the database using the user's access key.
 * Then every piece of information is hashed using hmac resulting in a signature.
 * This signature is checked against the signature sent to see if they match.
 * If succesful, the user can carry on with the api call, otherwise a 401 message is sent
 */
function checkHmac(req, res, next) {
    const accessKey = req.headers["accesskey"];
    const reqSignature = req.headers["signature"];
    const body = JSON.stringify(req.body);
    const params = req.params;

    db.users.findOne({
        accesskey: accessKey
    }, {
        fields: [
            "secretkey"
        ]
    }).then(result => {
        const userSecretKey = result.secretkey;

        var hmac = crypto.createHmac('sha256', userSecretKey);
        hmac.update(userSecretKey + body + params + accessKey);
        var signature = hmac.digest('hex');

        if (reqSignature == signature) {
            next()
        } else {
            return res.sendStatus(401);
        }

    }).catch((error) => {
        res.json(error);
        console.log(error, 'Promise error');
    });
}