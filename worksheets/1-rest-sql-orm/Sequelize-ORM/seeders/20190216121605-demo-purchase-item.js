'use strict';

module.exports = {
  
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('purchase_items', [{
      id: 3000,
      purchase_id: 1,
      product_id: 3,
      price: 300.00,
      quantity: 9192,
      state: 'Delivered'

    }], {});

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('purchase_items', { where: { quantity: 9191 } }, {});
  }

};