const config = require('../config.js');
const cryptojs = require("crypto-js");
const hmag_gen = require('./hmac_gen');


module.exports = (req, res, next) => {
    // check for hmac client
    if(req.headers.authorization){
        // retrieve hmac for client
        var clientHMAC = hmag_gen.getHMAC(req);

        req.app.get('db').users.find({
            'key' : clientHMAC.Key
        })
        .then(items =>{
            if(items.length === 0) {
                res.status(401).json({
                    "status": "Unauthorised",
                    "message": "Incorrect key provided"
                  }); 
            }
            else{
                var newURL = req.protocol + '://' + req.get('host') + req.originalUrl;

                // server signature
                 var serverSignature = cryptojs.HmacSHA256(
                 items[0].username + ' ' + items[0].key + ' ' + newURL,
                 items[0].secret_key
                 );

                 console.log(serverSignature.toString());
                 console.log(clientHMAC.Signature);
                 console.log("serverSignature");

                 if(serverSignature.toString() === clientHMAC.Signature){
                     req.user = items[0].username;
                    //back to where called from
                     next();
                 }
                 else{
                    res.status(401).json({
                        "status": "Unauthorised",
                        "message": "Signatures are not similar"
                      }); 
                 }

            }
        }).catch(error => {
            console.error(error);
        })
    }
    else{
        return res.status(401).json({
            "status": "Unauthorised",
            "message": "Token not provided"
          }); 
    }

    return;
}
