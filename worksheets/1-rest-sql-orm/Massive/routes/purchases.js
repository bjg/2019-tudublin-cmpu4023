const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const queryString = 'select a.name, a.address, b.email, c.price, c.quantity, c.state from purchases a ' +
        'join users b on a.user_id = b.id ' +
        'join purchase_items c on a.id = c.purchase_id ';

    req.app.get('db').query(queryString)
        .catch(err => { console.log('Failed to load users from DB'); })
        .then(items => {
            res.send( JSON.stringify(items, null, 2) );
        });
});

module.exports = router;