'use strict';

 module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('purchase_items', [{
		state: 'Delivered',
		price: 20.00,
		quantity: 1
		}], {});
	},

	down: (queryInterface, Sequelize) => {
	return queryInterface.bulkDelete('purchase_items', null, {});
	}
};