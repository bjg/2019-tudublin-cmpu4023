'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert('purchase_items', [
     {
       purchase_id: '2',
       product_id: '5',
       price: '875',
       quantity: '4',
       state: 'Pending'
     },
     {
      purchase_id: '26',
      product_id: '20',
      price: '34.76',
      quantity: '2',
      state: 'Pending'
     }
   ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('purchase_items', {
     purchase_id: ['2', '26'],
     product_id: ['5','20'],
     state: ['Pending']
   });
  }
};
