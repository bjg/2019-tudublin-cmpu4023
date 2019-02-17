'use strict';
//start at id 1500 to avoid conflicts with sql dump file
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('purchase_items', [{
	    id:1501,
		purchase_id:1001,
		product_id: 23,
        price: 50,
        quantity:20,
		state:'Dispatched'
      },
	  {
	    id:1502,
		purchase_id:1001,
		product_id: 24,
        price: 50,
        quantity:20,
		state:'Delivered'
      }
	  ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('purchase_items', null, {});
  }
};
