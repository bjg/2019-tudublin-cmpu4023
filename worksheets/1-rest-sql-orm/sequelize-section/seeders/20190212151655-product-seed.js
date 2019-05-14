'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("products", [{
			id: 21,
			title: "The Video Store",
			price: 9.99,
			created_at: new Date(),
			tags: ["Book"]
		}, {
			id: 22,
			title: "Behemoth",
			price: 23.99,
			created_at: new Date(),
			tags: ["Music", "Vinyl"]
		}, {
			id: 23,
			title: "Pulp Fiction",
			price: 5.99,
			created_at: new Date(),
			tags: ["Movie"]
		}], {});
	}
};