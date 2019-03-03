const productService = require('../services/product');
function getProducts(req, res){
    productService.getAll()
    .then(data => res.send(data));
};
function getProduct(req, res){
    productService.getById(req.params.id)
    .then(data => res.send(data));
}
function addProduct(req, res){
    productService.add({
        title: req.body.title,
        user_id: 1
    })
    .then(data => res.send(data));
};
module.exports = {
    getProducts,
    getProduct,
    addProduct
}
