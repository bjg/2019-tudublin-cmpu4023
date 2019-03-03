let jwt = require('jsonwebtoken')
const path = require("path");

module.exports.verifyToken = function (req, res, next) {
        var bearerHeader = req.headers["authorization"]
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(" ")
            const bearerToken = bearer[1]

            jwt.verify(bearerToken, 'SECRET_KEY', (err, result) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(403)
                    } else {
                        next();
                    }
                })
            }else{
                console.log('error');
                    res.sendStatus(403)
                }
}
