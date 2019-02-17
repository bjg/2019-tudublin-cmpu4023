'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("users", [{
			id: 51,
			email: "john@gmail.com",
			password: "dfjvkhfvjkdfhb5446h402huv",
			created_at: (new Date())
		},
		{
			id: 52,
			email: "denny@gmail.com",
			password: "klnvdfjkbndfjklbdf",
			created_at: (new Date())
		},
		{
			id: 53,
			email: "jenny@gmail.com",
			password: "kbngklbjgklbjngbdkl",
			created_at: (new Date())
		}], {});
	}
};