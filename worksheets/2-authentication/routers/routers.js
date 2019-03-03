module.exports = function(app) {

    var userController = require('../controllers/userController.js');
    var productController = require('../controllers/productController.js');
    var authController = require('../auth/jwtLogin.js');

//********************************************************************************
    // get basic-auth all users
	app.route('/basic/users')
        .get(userController.getAllUsers);
    
    app.route('/basic/products')
        .get(productController.getAllProducts);
    
//********************************************************************************
    // token routes
    app.route('/auth/jwt/login')
		.get(authController.jwtLogin);

	app.route('/jwt/users')
    .get(userController.getAllUsers);

    app.route('/jwt/products')
    .get(productController.getAllProducts);

//********************************************************************************

	// HMAC Routes
	app.route('/hmac/users')
		.get(userController.getAllUsers);

	app.route('/hmac/products')
		.get(productController.getAllProducts);
};

