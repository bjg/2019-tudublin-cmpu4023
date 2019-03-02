'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PurchaseItems_Sequelizes', [{
      purchases_sequelizeID: 1,
      products_sequelizeID: 1,
      price: 200.00,
      quantity: 5,
      state: 'Florida'
    }])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PurchaseItems_Sequelizes', null, {});

  }
};
