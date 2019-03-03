const express = require("express");
const methods = require("../methods");
const router = express.Router();

router.get("/", methods.ensureToken, (req, res, next) => {

    req.app.get('db').query('select * from products')
        .catch(err => { console.log(err); res.send('Error: Could not load db') })
        .then(items => {
            res.send( JSON.stringify(items, null, 2) );
        });
});

module.exports = router;