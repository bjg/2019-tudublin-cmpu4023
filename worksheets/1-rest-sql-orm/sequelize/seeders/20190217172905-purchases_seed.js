'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('purchases', [{
        name: 'Jose Rizal',
        address: '88 Bravado Avenue',
        state: 'MA',
        zipcode: 1,
        user: 83
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('purchases', null, {});
  }
};
