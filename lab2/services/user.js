const sequelize = require('../db');
const Users = require('../models').User;
const products = require('../models').products;

const addUser = user => Users.create(user);





module.exports = {
	addUser,
	
	getUserByLogin
}