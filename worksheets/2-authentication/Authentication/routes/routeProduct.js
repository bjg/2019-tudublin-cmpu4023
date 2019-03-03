/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 2
 *	Questions: All
 *	Type: Product Route."
 ***/

const responseCode = require('../response/response');

exports.getProducts = (req, res) => {
    
    req.app.get('db').products.find({}).then(results => {
        
        responseCode.responseOkWithData(res, null, results);
        
    }).catch(error => {
        
        console.error(error);
        responseCode.responseDefaultError(res);
    });
};
