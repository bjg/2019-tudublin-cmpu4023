'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('purchases', [
		{id: 1001, name: "J J", address: "123 Fake st.", zipcode: "12345", state: "AB", user_id: 1},
		{id: 1002, name: "K K", address: "124 Fake st.", zipcode: "12345", state: "AB", user_id: 2}
	], {});
  }
};
