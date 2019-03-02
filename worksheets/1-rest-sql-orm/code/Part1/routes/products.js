var express = require('express');
var router = express.Router();

/*  TEST
    curl localhost:3000/products    */
router.get('/', function(req, res) {
    req.app.get('db').products.find(
        {},
        {
            fields: ['title', "price", "created_at", "deleted_at", "tags"],
            order: [{
                field: 'price',
                direction: 'asc',
                nulls: 'last'
            }]
        }
    )
    .catch( err => { console.log('Failed to load products from DB'); })
    .then( products => {
        if(products.length == 0)
            console.log('No results returned');
        
        res.send(JSON.stringify(products, null, 2));
        // res.render('productList', {root: products });
    } );
});

/*  TEST
    curl localhost:3000/products/1    */
router.get('/:id', function(req, res) {
    req.app.get('db').products.findOne(
        { id: req.params.id },
        {
            fields: ['title', "price", "created_at", "deleted_at", "tags"]
        }
    )
    .catch( err => { console.log('Failed to load product from DB'); })
    .then( product => {
        res.send(JSON.stringify(product, null, 2));
        // res.render('productView', product);
    } );
});

module.exports = router;
