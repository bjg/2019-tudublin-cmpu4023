const Product = require('../config.js').product;

exports.create = (product, res) => {
    
    /* Validate Input */
    if(product.title == null){
        res.send('Title must be specified for Product'); 
        return;
    }
    
    if(product.price == null){
        res.send('Price must be specified for Product'); 
        return;
    }
    
    Product.create({
        title: product.title,
        price: product.price,
        tags: product.tags
    },{
        fields: ['title', 'price', 'tags']
    }).then( product => {
        res.send( JSON.stringify( product, null, 2 ) );
        //res.render('productView', product);
    })
};

exports.findAll = (req, res) => {
    Product.findAll().then(products => {
        res.send( JSON.stringify( products, null, 2 ) );
    })
};

exports.findByName = (name, res) => {
    Product.findAll({
        where: { title: name }
    }).then(products => {
        res.send( JSON.stringify( products, null, 2 ) );
    })
};

exports.findByPk = (req, res) => {
    Product.findOne({ 
        where: { id: req.params.id },
    }).then(product => {
        res.send( JSON.stringify( product, null, 2 ) );
    })
};

exports.deleteByPk = (req, res) => {
    Product.destroy({ 
        where: { id: req.params.id },
    }).then(numDeleted => {
        res.send( numDeleted + ' products deleted' );
    })
};

exports.update = (req, res) => {
    
    Product.update(req.body, { 
        where: { id: req.params.id }
    }).then(numUpdated => {
        if(numUpdated == 1)
            exports.findByPk(req, res);
        else 
            res.send("Failed to update product");
    })
};
