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
      {purchase_id: '100',product_id: '5',price: '86.99',quantity: '10',state: 'Pending'
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
      purchase_id: ['100']
	  product_id: ['5']
      state: ['Pending']
    });
  }
};
