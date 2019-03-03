const auth = require('basic-auth');
const config = require('../config.js');
const jwt = require('jsonwebtoken');

exports.jwtLogin = (req, res, next) => {
  var user = auth(req);

  if (!user ) {
    return res.status(401).json({
        "status": "Unauthorised",
        "message": "Not authorised without an account"
      });
  }

  else{
    var userDB = "SELECT * FROM users where username = $1 AND password = crypt($2, password);";

    //try to get user from database
    req.app.get('db').query(userDB, [user.name, user.pass])
    .then( items => {
        //if no user exists 
        if(items.length === 0){
            return res.status(401).json({
                "status": "Unauthorised",
                "message": "Credentials are incorrect"
              });
        }
        else{
            // Create token and sign with private key
            token = jwt.sign(
              { id: user.name },
              config.PRIVATE_KEY,
              {
                algorithm: 'RS256',
                issuer: 'http://localhost:3000/',
                expiresIn: '1h'
              }
            );

            res.status(200).json({
              "status": "Ok",
              "message": "",
              "token": token
            });

            next();
        }
    })
  }
  return;
};