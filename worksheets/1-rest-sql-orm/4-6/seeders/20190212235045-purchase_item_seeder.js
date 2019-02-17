'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('purchase_items', [
    {
      purchase_id: 3,
      product_id: 2,
      price: 22,
      quantity: 200,
      state:'CA',
      created_at:new Date(),
      updated_at:new Date(),
    },
    {
      purchase_id: 4,
      product_id: 5,
      price: 12,
      quantity: 12,
      state:'LA',
      created_at:new Date(),
      updated_at:new Date(),
    },
    {
      purchase_id: 7,
      product_id: 19,
      price: 200,
      quantity: 10,
      state:'WA',
      created_at:new Date(),
      updated_at:new Date(),
    },
    {
      purchase_id: 8,
      product_id: 14,
      price: 10,
      quantity: 2,
      state:'D',
      created_at:new Date(),
      updated_at:new Date(),
    },
    ]);
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
