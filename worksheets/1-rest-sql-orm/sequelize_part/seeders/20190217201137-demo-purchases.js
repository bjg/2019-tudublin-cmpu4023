'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
	  return queryInterface.bulkInsert('purchases', [{
        name: 'Bigus Manus',
        zipcode: 12345,
		address: '121 45th St.',
		state: 'FL',
		user_id: 51
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('purchases', null, {});
  }
};
