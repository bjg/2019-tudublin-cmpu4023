const jwt = require('jsonwebtoken');
const config =  require('../config');
const checkAuth = (req, res, next) => {
    var token = req.headers['token'];
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token.' });
    
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err)
            return res.status(500).send({ auth: false, message: 'authentication fail.' });
    req.user = {
         login: decoded.login,
         id: decoded.id
    };
    next();
    });
}
module.exports = {
    checkAuth
}
app.get('/products', authMiddleware.checkAuth, productController.getproducts);
 app.post('/products', authMiddleware.checkAuth, productsController.addProducts);
