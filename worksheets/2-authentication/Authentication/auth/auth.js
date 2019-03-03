/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 2
 *	Questions: 1
 *	Type: Simple Auth"
 ***/

const config = require('../config.js');
const requestCode = require('../response/request');
const responseCode = require('../response/response');

module.exports = (req, res, next) => {
    
    let user = requestCode.authUser(req);

    if (!user) { // If details are not provided respond with a 401 error.

        return responseCode.responseUnauthorised(res, "Please provide the information for the user");
        
    } else { // Username and Password are provided.
        
        // Retrieve from database and store.
        let dbUser = "SELECT * FROM users where username = $1 AND password = crypt($2, password);";
        
        // Get user from the database.
        req.app.get('db').query(dbUser, [user.name, user.pass])
        
        .then(results => {

            if (results.length === 0) { // If user does not exist.
                
                responseCode.responseUnauthorised(res, "Either the username, password or both are incorrect.");
                
            } else { // The correct information has been supplied.
                
                req.user = user.name;
                
                next();
            }
        })
        .catch(error => { // Catch any errors.
            
            console.log(error);
            responseCode.responseDefaultError(res);
        });
    }

    return;
};