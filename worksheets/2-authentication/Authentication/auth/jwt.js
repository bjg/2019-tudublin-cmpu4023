/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 2
 *	Question: 2
 *	Type: JWT Auth"
 ***/

// https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e

const jwt = require('jsonwebtoken');

const config = require('../config.js');
const responseCode = require('../response/response');

module.exports = (req, res, next) => {
    
    if (req.token) { // Check for token to see if it exists in header.
        
        try {
            
            // Token verification.
            let token = jwt.verify(req.token, config.PUBLIC_KEY, { algorithms: ['RS256'] });

            // Set the current user.
            req.user = token.id;

            next();
            
        } catch (error) { // If the details are incorrect, catch and display the error.
            
            console.log(error);
            
            return responseCode.responseUnauthorised(res, "Either the username, password or both are incorrect.");
        }
        
    } else { // If the token was not provided.
        
        return responseCode.responseUnauthorised(res, "Failed as there was no token provided.");
    }

    return;
};