'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Sequelized_purchase_items', [{
      purchase_id: 1,
      product_id: 3,
      price: "13.95",
      quantity: 1,
      state: "Pending"
    },
    {
      purchase_id: 2,
      product_id: 1,
      price: "11.99",
      quantity: 1,
      state: "Delivered"
    },
    {
      purchase_id: 2,
      product_id: 2,
      price: "18.99",
      quantity: 1,
      state: "Delivered"
    },
    {
      purchase_id: 3,
      product_id: 6,
      price: "15.00",
      quantity: 1,
      state: "Pending"
    },
    {
      purchase_id: 4,
      product_id: 4,
      price: "6.66",
      quantity: 6,
      state: "Delivered"
    },
    {
      purchase_id: 5,
      product_id: 5,
      price: "119.85",
      quantity: 1,
      state: "Returned"
    },], {});
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
