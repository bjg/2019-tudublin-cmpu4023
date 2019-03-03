const authController = require('./controllers/auth');
const productController = require('./controllers/product');
const authMiddleware = require('./middlewares/auth');
const userController = require('./controllers/user');


module.exports.set = app => {
    app.post('/login', authController.login);
    app.post('/register', authController.register);
    app.get('/products', authMiddleware.checkAuth,productController.getProducts);
    app.get('/products/:id', authMiddleware.checkAuth,productController.getProduct);
    app.post('/products', authMiddleware.checkAuth,productController.addProduct);
    app.get('/user_products', authMiddleware.checkAuth, userController.getUsersWithProducts);
}