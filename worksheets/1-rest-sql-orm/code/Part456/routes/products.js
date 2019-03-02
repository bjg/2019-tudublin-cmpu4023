var express = require('express');
var router = express.Router();

const ProductController = require('../controllers/productController.js');

/*  TEST
 *  curl localhost:3000/products 
    curl localhost:3000/products?name=Dictionary */
router.get('/', (req, res) => {
    if(req.query.name == null)
        ProductController.findAll(req, res);
    else 
        ProductController.findByName(req.query.name, res);
});

/*  TEST
 *  curl localhost:3000/products/1 */
router.get('/:id', (req, res) => {
    ProductController.findByPk(req, res);
});

/*  TEST
 *  curl -X PUT -d price=543.45 localhost:3000/products/1 */
router.put('/:id', (req, res) => {
    ProductController.update(req, res);
});

/*  TEST
 *  curl -X DELETE localhost:3000/products/20 */
router.delete('/:id', (req, res) => {
    ProductController.deleteByPk(req, res);
});

/*  TEST
 *  curl -X POST -d title=Monitor -d price=200.50 -d tags='["electronic"]' localhost:3000/products */
router.post('/', (req, res) => {
    ProductController.create({
        title: req.body.title,
        price: req.body.price,
        tags: JSON.parse(req.body.tags)
    }, res);
});

module.exports = router;
