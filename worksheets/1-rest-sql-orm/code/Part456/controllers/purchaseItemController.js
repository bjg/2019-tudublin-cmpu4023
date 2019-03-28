const PurchaseItem = require('../config.js').purchaseItem;

exports.create = (req, res) => {
    
    /* Validate Input */
    if(req.query.price == null){
        res.send('Price must be specified for PurchaseItem'); 
        return;
    }
    
    if(req.query.quantity == null){
        res.send('Quantity must be specified for PurchaseItem'); 
        return;
    }
    
    PurchaseItem.create({
        price: req.query.price,
        state: req.query.state,
        quantity: req.query.quantity
    }).then( purchaseItem => {
        res.send('Purchase Item Created');
    })
};

exports.findById = (req, res) => {	
    PurchaseItem.findById(req.params.purchaseItemId).then(purchaseItem => {
        res.send( JSON.stringify( purchaseItem, null, 2 ) );
    })
};
