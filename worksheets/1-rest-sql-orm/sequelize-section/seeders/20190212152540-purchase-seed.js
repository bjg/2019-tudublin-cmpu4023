'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("purchases", [{
			id: 1001,
			created_at: new Date(),
			address: "1 Fake Street",
			zipcode: 25,
			user_id: 51
		}, {
			id: 1002,
			created_at: new Date(),
			address: "6 Rich Street",
			zipcode: 65,
			user_id: 51
		}, {
			id: 1003,
			created_at: new Date(),
			address: "20 Web Street",
			zipcode: 305,
			user_id: 52
		}], {});
	}
};