'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('purchase_items', [
        {
          purchase_id: 1,
          product_id: 1,
          price: 500.00,
          quantity: 2,
          state: 'delivered',
          createdAt: '2009-03-08 03:06:00+00',
          updatedAt: '2009-03-08 03:06:00+00'
        },
        {
          purchase_id: 2,
          product_id: 2,
          price: 450,
          quantity: 1,
          state: 'delivered',
          createdAt: '2010-11-12 21:27:00+00',
          updatedAt: '2010-11-12 21:27:00+00'
        },
        {
          purchase_id: 3,
          product_id: 3,
          price: 700,
          quantity: 5,
          state: 'delivered',
          createdAt: '2009-12-20 20:36:00+00',
          updatedAt: '2009-12-20 20:36:00+00'
        }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('purchase_items', null, {});
  }
};
