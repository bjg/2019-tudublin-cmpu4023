const express = require('express')
const massive = require('massive');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');

const app = express()
const port = 3002
app.use(bodyParser.json());
var db;

var secretKey = "thisisaverysecretkey"

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

/**Stored function in the database
*CREATE OR REPLACE FUNCTION Authenticate2(a text, b text)
RETURNS BIGINT 
LANGUAGE sql 
AS $$ 
select COUNT(*) from users where username = (a) AND password =crypt((b), password);
$$;
*/
app.post('/login', function (req, res) {

    let username = req.body.username;
    let password = req.body.password;

    /**
     * Calls the stored function and if the username and password are correct it will return 1, otherwise 0.
     * Then, a new token is issued by JWT using the server's secretkey with an expiration of 24hrs and it will send it back to the user with a status of 200,
     * if it fails it will return 401.
     */
    db.query(
            'SELECT Authenticate2( \'' + username + '\' , \'' + password + '\');'
        ).then(result => {

            if (result[0].authenticate2 == 1) {

                jwt.sign({
                    username: username
                }, secretKey, {
                    expiresIn: '24h'
                }, (err, token) => {

                    if (err) {
                        res.sendStatus(401)

                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'Authenticated',
                            token: token
                        });
                    }
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Wrong Credentials'
                })
            }

        })
        .catch((error) => {
            console.log(error, 'Promise error');
        });
});


app.get('/api', function (req, res) {
    res.json({
        text: "Hello World"
    })
})

/**
 * GET Products endpoint which calls checkToken first beofre returning the information.
 */
app.get('/products', checkToken, function (req, res) {

    db.products.find({}, {}).then(products =>

            res.status(200).json(products))

        .catch((error) => {
            res.json(error);
            console.log(error, 'Promise error');
        });
})

/**
 * POST Products endpoint which calls checkToken first beofre returning the information.
 */
app.post('/products', checkToken, checkHmac, function (req, res) {

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
 * PUT Products endpoint which calls checkToken first beofre returning the information.
 */
app.put('/products/:id', checkToken, checkHmac, function (req, res) {

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


/**
 * 
 * @param {req} user's request information  
 * @param {res} used if the function needs to send a response to the user
 * @param {next} used to carry on woth the call if the token is valid
 * 
 * The function gets the token from the header. Because the token is sent in the form "Bearer   token"
 * the strin needs to be split so we can get the token itself. 
 * JWT then verifies if the token is valid by checking it agains the server's secret token, if succesful the user can carry out with the call,
 * otherwise the program sends a 401 message
 */
function checkToken(req, res, next) {
    const bearerToken = req.headers["authorization"]

    if (bearerToken) {

        const bearer = bearerToken.split(" ");
        const token = bearer[1];
        req.token = bearerToken;

        jwt.verify(token, secretKey, (err, decoded) => {

            if (err) {
                return res.sendStatus(401)
            } else {
                req.decoded = decoded;
                next();
            }

        })
    } else {
        return res.sendStatus(401);
    }
}

//The REST server will listen at port 3002 for incoming requests
app.listen(port, () => console.log(`Example app listening on port ${port}!`))