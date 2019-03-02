let jwt = require('jsonwebtoken')
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
            }else{
                console.log('error');
                    res.sendStatus(403)
                }
}//end validateToken



module.exports.validateTokenAsync = function (req, res, next) {
    var bearerHeader = req.headers["authorization"]
    var publicKey = fs.readFileSync(path.join(__dirname, '../public.key.pem'),"utf-8");
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]

        jwt.verify(bearerToken, publicKey, (err, result) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(403)
                } else {
                    next(); // we are now verified, so we can use other or next methods
                }
            })
        }else{
            console.log('error');
                res.sendStatus(403)
            }

    
}//end validateTokenAsync