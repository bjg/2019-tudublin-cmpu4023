const userService = require('../services/user');

function getUsersWithProducts(req, res){
	return userService.getUsersWithProducts()
	.then(data => res.send(data));
};

module.exports = {
	getUsersWithProducts
}
