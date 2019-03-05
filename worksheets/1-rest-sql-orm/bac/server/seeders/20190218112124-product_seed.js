'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products_Sequelizes', [{
      title: 'Product1',
      price: 22.00,
      tags: 'testType'
    }])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products_Sequelizes', null, {});
  }
};

