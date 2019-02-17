'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('purchase_items', [{
      price: 100.00,
      quantity: 2,
      state: 'Delivered'
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('purchase_items', null, {});
  }
};
