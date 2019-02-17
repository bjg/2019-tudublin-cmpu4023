'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('purchase_items', [{
        purchase_id: 1000,
        product_id: 1,
        price: 29.99,
        quantity: 999,
        state: 'Delivered'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('purchase_I=items', { where: { quantity: 999 } }, {});
  }
};
