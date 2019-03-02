'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('products', [
		{id: 101, title: "new product 1", price: "12.34", tags: ["stuff"]},
		{id: 102, title: "new product 2", price: "56.78", tags: ["stuff", "more stuff"]}
	], {});
  }
};
