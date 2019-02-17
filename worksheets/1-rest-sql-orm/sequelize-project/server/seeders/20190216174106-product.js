'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('products', [{
      title: 'Samsung Galaxy S9+',
      price: 999.99,
      tags: ['Technology']
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('products', null, {});
  }
};
