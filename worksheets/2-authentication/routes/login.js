const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post('/',(req, res, next) => {
    let p_email = req.body.email;
    let p_password = req.body.password;
    const queryString = 'SELECT id, password = crypt(\''+ p_password + '\', password) as auth FROM users ' +
        'where email = \'' + p_email + '\';';

    console.log(queryString);
    req.app.get('db').query(queryString)
        .catch(err => { console.log(err); res.send('Error: Could not authenticate user') })
        .then(items => {
            if (items.length > 0) {
                if (items[0].auth === true) {
                    const token = jwt.sign(
                        {id: items[0].id},
                        'secret',
                        {
                            expiresIn: 60 * 5
                        },
                        (err, token) => {
                            res.send({
                                ok: true,
                                status: 200,
                                message: "Login successful",
                                tokenTTL: "5 minutes",
                                token: token
                            })
                        })
                } else {
                    res.send({
                        status: 401,
                        ok: false,
                        message: "Email or password incorrect"
                    });
                }
        } else {
                res.send({
                    status: 401,
                    ok: false,
                    message: "Email or password incorrect"
                });
            }
        });

});


module.exports = router;
