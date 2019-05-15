'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('products', [{
		title: 'Shawshank Redemption',
		price: 20.00,
		tags: '{Book,Adventure}'
		}], {});
},

	down: (queryInterface, Sequelize) => {
	return queryInterface.bulkDelete('products', null, {});
	}
};