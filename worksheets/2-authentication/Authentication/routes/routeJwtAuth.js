/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 2
 *	Questions: All
 *	Type: JWT Route."
 ***/

const jwt = require('jsonwebtoken');
const auth = require('basic-auth');

const responseCode = require('../response/response');
const config = require('../config.js');

exports.authJwtFxn = (req, res) => {
    
    let user = auth(req);

    if (!user) { // Check for user basic auth header.
        
        responseCode.responseUnauthorised(res, "Please provide the information for the user");
        
    } else {
        
        // Retrieve from database and store.
        let dbUser = "SELECT * FROM users where username = $1 AND password = crypt($2, password);";

        // Get user from the database.
        req.app.get('db').query(dbUser, [user.name, user.pass])
        
        .then(results => {
            
            // If user does not exist.
            if (results.length !== 0) {
                
                // Signing options.
                let signOptions = { issuer: config.MAIN_URL_APP, expiresIn: "1h", algorithm: "RS256" };

                // Create a new token and sign in.
                let token = jwt.sign( { id: user.name }, config.PRIVATE_KEY, signOptions);
                
                // Send a response with the token.
                responseCode.responseOkWithData(res, null, token);
                
            } else { // Anything else is incorrect.
                
                responseCode.responseUnauthorised(res, "Either the username, password or both are incorrect.");
            }
            
        }).catch(error => { // Catch any errors.
            
            console.log(error);
            responseCode.responseDefaultError(res);
        });
    }
};