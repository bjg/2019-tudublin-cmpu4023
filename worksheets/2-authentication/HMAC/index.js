const express = require('express')
const app = express();
const port = 3000;
const massive = require('massive');
const bodyParser = require('body-parser');

const http = require('http');

let conn = require('./conn.json');
const crypto = require('crypto');


app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());


massive({
    host: conn.host,
    port: conn.port,
    database: conn.database,
    user: conn.user,
    password: conn.password,
    poolSize: conn.poolSize
}).then(instance => {
    console.log("Connected to the database");
    app.set('db', instance);
});


function check_signature(req, res, next) {
    /*
        From the request we get the access_key, signature and messsage
    */
    var access_key = req.headers['access_key'];
    var signature = req.headers['signature'];
    var msg = req.query.msg;
    let bodyMessage = req.body.message;

    console.log("Access Key Recieved: " + access_key);
    console.log("Signature Recieved: " + signature);

    app.get('db').query(
        'SELECT * FROM users WHERE access_key= \'' + access_key + '\''
    ).then(user => {
        // If a user exits
        if (user[0] !== undefined) {
            var dbSecretKey = user[0]['secret_key']; // retrieving the user's secret_key from the database
            const HMAC = crypto.createHmac('sha256', dbSecretKey); //create HMAC with the secret_key

            if (bodyMessage !== undefined) {
                console.log("Message sent in body : " + bodyMessage);
                HMAC.update(bodyMessage); //Adding message to the hash signature (dbSecretKey + message)
            } else {
                // //If a query parameter is passed in the request of the body 
                if (msg !== undefined) {
                    console.log("Message sent as parameter: " + msg);
                    HMAC.update(msg); // By doing this, we add the message to the previously hashed value => (dbSecretKey + message)
                }
            }


            /*
                  Now that the HMAC holds both the server known secret key and the message
                  We can calculate what the signature should look like
            */
            const server_calculated_signature = HMAC.digest('hex');
            console.log("Calculated signature: " + server_calculated_signature);
            //Compare the passed signature in the request with the calculated hash signature by the server

            if (signature === server_calculated_signature) {

                console.log('Signatures match!');
                next();//If they match we can proceed to display the protected resource to the user
            } else {
                console.log('Signature not valid');
                return res.status(401).send("Authentication Denied: No match for signature");
            }
        } else {
            console.log('Access key not valid');
            return res.status(401).send("Authentication Denied: No match for access key");
        }
    });
}

app.get('/', check_signature, (req, res) => res.send('Access Granted!'))

app.get('/client', function (req, res) {
    var client_access_key = '1fad2e43de9d6b4d8b0711f499b7b1b445170b6a';
    var client_secret_key = 'b530bd4f34e27c6257aeaae10ed0403dc66c0a22ab4788f6869abb6756a73a78138bcdfe03e61411';
    var client_msg = 'test123';
    const HMAC = crypto.createHmac('sha256', client_secret_key); //create HMAC with the secret_key
    HMAC.update(client_msg);
    const client_calculated_signature = HMAC.digest('hex');
    console.log();
    console.log("Access key from client = " + client_access_key);
    console.log("Signature from client= " + client_calculated_signature);
    console.log("Message from client= " + client_msg);
    console.log();
    const options = {
        hostname: 'localhost',
        port: port,
        path: "http://localhost:3000/?msg=" + client_msg,
        method: "GET",//Use POST to send message body
        headers: {
            'Content-Type': 'application/json',
            'access_key': client_access_key,
            'signature': client_calculated_signature
        }
    };
    const req1 = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (d) => {
            process.stdout.write(d)
        })
    })

    req1.on('error', (error) => {
        console.error('problem with request:' + error);
    })

    req1.end()
    res.status(200).send("Successfully sent");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// CREATE TABLE users(
//     ID int NOT NULL PRIMARY KEY,
//     username varchar(255),
//     password varchar(255),
//     access_key varchar(40),
//     secret_key varchar(80)
// );


// create extension pgcrypto;

// access key: ripemd160 
// secret key : ripemd320
// signature key: SHA256

// INSERT INTO users (id, username, password, access_key, secret_key) VALUES (1, 'user1', crypt('password1', gen_salt('bf', 8)), '1fad2e43de9d6b4d8b0711f499b7b1b445170b6a' ,'b530bd4f34e27c6257aeaae10ed0403dc66c0a22ab4788f6869abb6756a73a78138bcdfe03e61411');
// INSERT INTO users (id, username, password, access_key, secret_key) VALUES (2, 'user2', crypt('password2', gen_salt('bf', 8)), '02786db0e65e76bd8043031f6a6292cbc763d010', 'a567c93b972b7b9ab9db6a9c1cdbea962116ef2e36da739fb98880cc084455085c3ffa787e1b9a9e');
// INSERT INTO users (id, username, password, access_key, secret_key) VALUES (3, 'user3', crypt('password3', gen_salt('bf', 8)), '99a8487019099bee8af8473134fa247c2f018790', '98ce2a74d2829821fec0b1048c3b73e88515c0999b329b7a0a8b09ab9ed72ba64301d3dff0975657');
