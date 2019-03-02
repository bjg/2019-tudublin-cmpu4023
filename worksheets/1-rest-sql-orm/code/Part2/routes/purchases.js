var express = require('express');
var router = express.Router();

/*  TEST
    curl localhost:3000/purchases    */
router.get('/', function(req, res, next) {
    req.app.get('db').query(
        "SELECT purchase_items.price, purchase_items.quantity, " + 
        "purchase_items.state, purchases.name, purchases.address, " + 
        "users.email, products.title " + 
        "FROM purchase_items " +
        "INNER JOIN purchases ON purchase_items.purchase_id=purchases.id " +
        "INNER JOIN users ON purchases.user_id=users.id " +
        "INNER JOIN products ON purchase_items.product_id=products.id " +
        "ORDER BY purchase_items.price DESC;"
    )
    .catch( err => { console.log('Failed to load purchases from DB'); })
    .then( purchases => {
        if(purchases == null || purchases.length == 0)
            console.log('No results returned');
          
        res.send(JSON.stringify(purchases, null, 2));  
        //res.render('purchaseList', {root: purchases });
    } );
});

module.exports = router;
