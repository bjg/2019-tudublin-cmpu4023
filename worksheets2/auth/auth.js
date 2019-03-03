const auth = require('basic-auth');
const config = require('../config.js');

module.exports = (req, res, next) => {
  var user = auth(req);

  if (!user ) {
    return res.status(401).json({
        "status": "Unauthorised",
        "message": "Not authorised without an account"
      });
  }

  else{
    var userDB = "SELECT * FROM users where username = $1 AND password = crypt($2, password);";

    //query user from database
    req.app.get('db').query(userDB, [user.name, user.pass])
    .then( items => {
        //if no user exists 
        if(items.length === 0){
            return res.status(401).json({
                "status": "Unauthorised",
                "message": "Not authorised without an account"
              });
        }
        else{
            req.user = user.name;
            //return where called from
            next();
        }
    })
  }
  return;
};
