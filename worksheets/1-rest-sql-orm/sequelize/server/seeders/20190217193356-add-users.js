'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
		{id: 101, email: "test3@test.com", password: "adfadsflkafgakjsh"},
		{id: 102, email: "test4@test.com", password: "afdafgasggasgasdf"}
	], {});
  }
};
