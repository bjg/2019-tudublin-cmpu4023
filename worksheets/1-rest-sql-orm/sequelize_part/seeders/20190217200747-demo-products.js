'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
	  return queryInterface.bulkInsert('products', [{
        title: 'the biggest book alive',
        price: 9.99,
		tags: '{Book,Technology}'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('products', null, {});
  }
};
