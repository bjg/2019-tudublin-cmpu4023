const productService = require('../services/products');
function getproducts(req, res){
    productService.getAll()
    .then(data => res.send(data));
};

function addproducts(req, res){
    productService.add({
        title: req.body.title,
        user_id: 1
    })
    .then(data => res.send(data));
};
module.exports = {
    getproducts,
    getproduct,
    addproducts
}