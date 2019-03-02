var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    
    const productId = req.query.productId;
    var whereQueryString = "";
    
    if(productId)
        whereQueryString = "WHERE products.id=" + productId;
    
    const queryString = "SELECT purchase_items.price, purchase_items.quantity, " + 
        "purchase_items.state, purchases.name, purchases.address, " + 
        "users.email, products.title " + 
        "FROM purchase_items " +
        "INNER JOIN purchases ON purchase_items.purchase_id=purchases.id " +
        "INNER JOIN users ON purchases.user_id=users.id " +
        "INNER JOIN products ON purchase_items.product_id=products.id " +
        whereQueryString + " " +
        "ORDER BY purchase_items.price DESC";
        
    console.log( queryString );
    
    req.app.get('db').query( queryString )
    .catch( err => { console.log('Failed to load purchases from DB'); })
    .then( purchases => {
        if(purchases == null || purchases.length == 0)
            console.log('No results returned');
        else {
            console.log('Results: ' + purchases.length);
            console.log(purchases[0]);
        }
        
        const outputString = JSON.stringify(purchases, null, 2);
            
        res.render('jsonOutput', { root: outputString });
    } );
});



module.exports = router;
