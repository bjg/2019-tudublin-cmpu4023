'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('purchase_items', [
      {
        purchase_id: '2',
        product_id: '3',
        price: '666.66',
        quantity: '2',
        state: 'Pending'
      },
      {
        purchase_id: '22',
        product_id: '20',
        price: '777.77',
        quantity: '7',
        state: 'Pending'
      }
    ], {});
},
down: (queryInterface, Sequelize) =>{
    return queryInterface.bulkDelete('purchase_items', {
      purchase_id: ['2', '22'],
      product_id: ['3',  '20'],
      state: ['Pending']
    });
  }
};


