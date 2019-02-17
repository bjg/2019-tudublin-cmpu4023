'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('purchases_items', [{
        id: 32,
        price: 101.58,
        quantity: 8,
        state: "Shipping"
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('purchases_items', null, {});
  }
};
