'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('purchases', [{
		name: 'Daniel Purchaser',
		zipcode: 4,
		address: '19 Malone, Dublin',
		state: 'DL',
		user_id: 51
		}], {});
},

	down: (queryInterface, Sequelize) => {
	return queryInterface.bulkDelete('purchases', null, {});
	}
};