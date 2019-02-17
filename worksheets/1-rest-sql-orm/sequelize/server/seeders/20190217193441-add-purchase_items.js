'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('purchase_items', [
		{id: 10001, purchase_id: 1, product_id: 1, price: 12.34, quantity: 2, state: "Delivered"},
		{id: 10002, purchase_id: 2, product_id: 2, price: 56.78, quantity: 3, state: "Delivered"}
	], {});
  }
};
