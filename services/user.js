const sequelize = require('../db');
const Users = require('../models').User;
const Products = require('../models').Product;
const addUser = user => Users.create(user);

const getUserByLogin = login => Users.findOne({where: {login}});

const getUsersWithProducts = () => {
	return Users.findAll({
		attributes: ['login', 'id'],
		include: [{
			model: Products,
			as: 'products',
			attributes: ['date', 'title']
		}],
	})
	.then(sequelize.getValues);
}

module.exports = {
    addUser,
    getUsersWithProducts,
    getUserByLogin
}