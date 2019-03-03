/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 2
 *	Question: 4
 *	Type: HMAC Auth"
 ***/

// https://www.npmjs.com/package/crypto-js
const crypto = require("crypto-js");

const config = require('../config.js');
const responseCode = require('../response/response');
const requestCode = require('../response/request');

module.exports = (req, res, next) => {

    // Check to see if there is a client HMAC.
    if (req.headers.authorization) {
        
        // Obtain the client's HMAC.
        let clientHmac = requestCode.clientHmac(req);

        // Find the user in the database using the key.
        req.app.get('db').users.find({ 'key': clientHmac.Key}).then(results => {

            if (results.length === 0) { // If user does not exist.
                
                responseCode.responseUnauthorised(res, "There is either no key or is invalid.");
                
            } else {
                
                let buildUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

                // Generate a signature from the server for comparison.
                let signatureFromServer = crypto.HmacSHA256(results[0].username + ' ' + results[0].key + ' ' + buildUrl, results[0].secret_key);
                
                // Compare the two signatures, from the server and client.
                if (signatureFromServer.toString() === clientHmac.Signature) {
                    
                    // If they match, set the user.
                    req.user = results[0].username;
                    
                    next();
                    
                } else { // If the signatures don't match (client and server) display an error message.
                    
                    responseCode.responseUnauthorised(res, "The signatures provided do not match.");
                }
            }
            
        }).catch(error => { // Catch any errors.
            
            console.error(error);
            responseCode.responseDefaultError(res);
        });
        
    } else {
        
        return responseCode.responseUnauthorised(res, "Failed as there was no token provided.");
    }

    return;
};


