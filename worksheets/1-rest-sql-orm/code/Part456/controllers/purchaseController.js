const Purchase = require('../config.js').purchase;

exports.create = (req, res) => {
    
    /* Validate Input */
    if(req.query.name == null){
        res.send('Name must be specified for Purchase'); 
        return;
    }
    
    Purchase.create({
        name: req.query.name,
        state: req.query.state,
        address: req.query.address,
        zipCode: req.query.zipCode
    }).then( purchase => {
        res.send('Purchase Created');
    })
};
