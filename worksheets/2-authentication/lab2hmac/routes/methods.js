let jwt = require('jsonwebtoken');

//HMAC stuff
let Ofuda = require('ofuda');
var hmac = new Ofuda({
    headerPrefix: 'Amz',
    hash: 'sha1',
    serviceLabel: 'AWS',
    debug: true
});


//file reading
const path = require("path"); // used for finding pu pr keys
const fs = require("fs");


module.exports.validateToken = function (req, res, next) {
    var bearerHeader = req.headers["authorization"]
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]

        jwt.verify(bearerToken, 'SECRET_KEY', (err, result) => {
            if (err) {
                console.log(err);
                res.sendStatus(403)
            } else {
                next(); // we are now verified, so we can use other or next methods
            }
        })
    } else {
        console.log('error');
        res.sendStatus(401)
    }
} //end validateToken

module.exports.validateTokenAsync = function (req, res, next) {
    var bearerHeader = req.headers["authorization"]
    var publicKey = fs.readFileSync(path.join(__dirname, '../public.key.pem'), "utf-8");
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]

        jwt.verify(bearerToken, publicKey, (err, result) => {
            if (err) {
                console.log(err);
                res.sendStatus(401)
            } else {
                next(); // we are now verified, so we can use other or next methods
            }
        })
    } else {
        console.log('error');
        res.sendStatus(401)
    }

} //end validateTokenAsync

//validate HMAC
var validateCredentials = function (requestAccessKeyId) {
    return {
        accessKeyId: requestAccessKeyId,
        accessKeySecret: 'h8IFhXWnRO3ySWRSlMIzzQW008Wue9PsQCCVSFJW'
    };
}

module.exports.validateHMAC = function (request, response, next) {
    if (hmac.validateHttpRequest(request, validateCredentials)) {
        next();
    } else {
        console.log('Error with authentication, credentials do not match');
        response.writeHead(401);
        response.end('Invalid Credentials!');
    }

} //end validateHMAC
