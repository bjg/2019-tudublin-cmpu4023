const express = require('express');
const massive = require('massive');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const app = express();
const port = 3000;

// Start massive
massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'lab2',
    user: 'markbarrett',
    password: 'password',
    enhancedFunctions: true
}).then(db => {
    // Set the express db instance
    app.set('db', db);
});

// Tell Express to use json and urlencode
app.use(express.json());
app.use(express.urlencoded());

/* JWT PART OF LAB */
// Pre-Authentication: Login API Route
app.post('/login/jwt', (req, res) => {
    // Try and find the user and compare the passwords
    app.get('db').query("SELECT * FROM users WHERE username='"+req.body.username+"' AND password=crypt('"+req.body.password+"', password)")
    .then((user) => {
        // Check to see if the response was empty
        if(user[0].id) {
            const payload = {
                user_id: user[0].id
            }
            // We now know that the details sent were fine. Now encode a JSON web token.
            jwt.sign({payload}, 'secretKey', {expiresIn: '24h'}, (err, token) => {
                // Send error if it exists
                if(err) {
                    res.status(401);
                    res.send('[ERROR]: '+err);
                } else{
                    res.json({ token });
                }
            });
        }
    }).catch((error) => {
        res.status(401);
        res.send('[ERROR]: Incorrect username or password.');
    });
});

// Example protected route products
app.get('/products/jwt', requireAuth, (req, res) => {
    app.get('db').product.find({}, {

    }).then((products) => {
        res.send(products);
    })
})

// In order to verify tokens in protected resources we need to create a mechanism that
// checks the checks the JWT token.
// We are going to create requireAuth, an express middleware that can be applied to any
// route to require authentication.
function requireAuth(req, res, next) {
    // Get the value from the header
    const bearerToken = getBearerToken(req.headers['authorization']);

    // Check if it is set
    if(bearerToken != 'undefined') {
        // Verify the token
        jwt.verify(bearerToken, 'secretKey', (err, decoded) => {
            // Send error if it exists
            if(err) {
                res.status(403);
                res.send('[ERROR]: '+err)
            } else {
                // The user has been authenticated.
                // Call the next middleware
                res.status(200);
                next();
            }
        })
    } else {
        res.status(401);
        res.send('[ERROR]: Invalid bearer token.');
    }
}

// Function to extract the token from the bearer token
function getBearerToken(bearerHeader) {
    // Check to see if its undefined
    if(bearerHeader == undefined) {
        return undefined;
    } else {
        // Split the string by space into array and take the second item in the array (the token)
        return bearerHeader.split(' ')[1];
    }
}

/* HMAC PART OF THE LAB */
// This function can be applied as middleware on an Express route.
// It will check the signature of the request.
function hmacAuth(req, res, next) {
    console.log(typeof(req.get('Access-Key')));
    // Check to make sure the access key has been sent
    if(req.get('Access-Key') == undefined || req.get('Access-Key') == '') {
        res.status(401);
        res.send('[ERROR]: No access key provided.');
        return;
    }

    // Get the access key from the request.
    const access_key = req.get('Access-Key');

    // Check to make sure a signature was provided.
    if (req.get('Signature') == undefined || req.get('Signature') == '') {
        res.status(401);
        res.send('[ERROR]: No signature provided.');
        return;
    }

    // Get the signature
    const signature = req.get('Signature').trim();

    // Define the shared secret key (Will be sent to each person prior to this somehow probably a Diffie-Hellman exchange)
    // Come back and do a Diffie-Hellman if time permits.
    const sharedSecret = 'helloworld';

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;

    // Now we have to construct the payload in order to check to see if the signature matches.
    var payload = '';

    // Check the request type and if its post then add the values to the payload
    if(req.method == 'POST') {
        for(var bodyElement in req.body) {
            if (req.body.hasOwnProperty(bodyElement)) {
                payload += req.body[bodyElement]
            }
        }
    }

    // Now add the query parameters
    for(var queryParam in req.query) {
        if(req.query.hasOwnProperty(queryParam)) {
            payload += req.query[queryParam];
        }
    }

    // Now that is all appended, append the access key
    payload += access_key;

    // Append the date too
    payload += today;

    // Now we have the payload, create the hmac
    hmac = crypto.createHmac('sha256', sharedSecret).update(payload);

    // Trim any whitespace
    var hmacString = hmac.digest('hex').trim();

    // Check if if they are equal to eachother, if they are then the request is authorised:
    // call the next middleware
    if (hmacString == signature) {
        next();
    } else {
        res.status(401);
        res.send('[ERROR]: Invalid signature.');
    }
}

// Using products as a protected resource for hmac. In this example
// there is no body or query parameters. The next route is an example of one with 
// a body.
app.get('/products/hmac', hmacAuth, (req, res) => {
    app.get('db').product.find({}, {

    }).then((products) => {
        res.send(products);
    })
})

// Using Login as an example of where hmac can be used.
// This can be a protected resource or a simple login request.
// Use hmacAuth as middleware
app.post('/login/hmac', hmacAuth, (req, res) => {
    // Try and find the user and compare the passwords
    app.get('db').query("SELECT * FROM users WHERE username='" + req.body.username + "' AND password=crypt('" + req.body.password + "', password)")
        .then((user) => {
            // Check to see if the response was empty
            if (user[0] != undefined) {
                res.send('User exists!');
            } else {
                res.status(401);
                res.send('Invalid username or password.');
            }
        }
    );
});

app.listen(port, () => console.log(`Express, listening on port ${port}!`));