'use strict';
//start at id 22 to avoid conflicts with sql dump file and dummy record for sql injection
module.exports = {
  up: (queryInterface, Sequelize) => {
  
      return queryInterface.bulkInsert('products',
	  [{
        id: 23,
        title: 'C Coding Book',
		created_at: new Date('2019-02-16'),
		price: 50,
		tags: ['Book', 'Programming']
      },
	  {
        id: 24,
        title: 'Rap CD',
		created_at: new Date('2019-02-16'),
		price: 20,
		tags: ['Technology', 'Music']
      },], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('products', null, {});
  }
};
