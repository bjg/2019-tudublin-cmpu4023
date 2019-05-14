'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('SeqPurchaseItems', [{
        purchase_id: 1,
        product_id: 4,
        price: 8.99,
        quantity: 1,
        state: "Delivered"
      }, {
        purchase_id: 1,
        product_id: 5,
        price: 14.99,
        quantity: 2,
        state: "Delivered"
      }, {
        purchase_id: 2,
        product_id: 3,
        price: 459.99,
        quantity: 1,
        state: "Pending"
      }, {
        purchase_id: 3,
        product_id: 1,
        price: 29.99,
        quantity: 1,
        state: "Returned"
      }, {
        purchase_id: 4,
        product_id: 2,
        price: 19.99,
        quantity: 2,
        state: "Delivered"
      }, {
        purchase_id: 4,
        product_id: 1,
        price: 29.99,
        quantity: 1,
        state: "Delivered"
      }, {
        purchase_id: 4,
        product_id: 5,
        price: 14.99,
        quantity: 1,
        state: "Delivered"
      }, {
        purchase_id: 5,
        product_id: 3,
        price: 459.99,
        quantity: 1,
        state: "Delivered"
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
