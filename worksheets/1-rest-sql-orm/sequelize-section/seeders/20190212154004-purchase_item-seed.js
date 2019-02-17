'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("purchase_items", [{
			id: 1500,
			purchase_id: 1001,
			product_id: 21,
			price: 19.99,
			quantity: 1,
			state: "Arriving"
		}, {
			id: 1501,
			purchase_id: 1002,
			product_id: 22,
			price: 50.99,
			quantity: 2,
			state: "Delivered"
		}, {
			id: 1502,
			purchase_id: 1002,
			product_id: 23,
			price: 9.99,
			quantity: 1,
			state: "Delivered"
		}, {
			id: 1503,
			purchase_id: 1003,
			product_id: 21,
			price: 19.99,
			quantity: 1,
			state: "Arriving"
		}], {});
	}
};