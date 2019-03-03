const jwt = require('jsonwebtoken');

module.exports.ensureToken = function(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    console.log(req.headers);

    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, 'secret', (err, result) => {
            if (err) {
                console.log(err);
                res.sendStatus(401)
            }
            else {
                next()
            }
        });
    } else {
        res.sendStatus(401)
    }
};