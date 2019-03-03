const jwt = require('jsonwebtoken');
const config = require('../config.js');

module.exports = (req, res, next) => {
    if(req.token) {
        try {
          // Verify the token,  If a callback is supplied, function acts asynchronously
          //    If a callback is not supplied, function acts synchronously.
          var token = jwt.verify(req.token, config.PUBLIC_KEY, { algorithms: ['RS256'] });

          //get the current user 
          req.user = token.id;
          next();
        } catch(err) {
          console.log(err);
          return res.status(401).json({
            "status": "Unauthorised",
            "message": "Can't authenticate token"
          });
        }
      }else {
        return res.status(401).json({
            "status": "Unauthorised",
            "message": "No token provided"
          });
      }
    
      return;

}