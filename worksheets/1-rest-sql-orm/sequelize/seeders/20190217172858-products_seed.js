'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('products', [{
        title: 'Headphones',
        price: 18.99,
        tags: ["Audio"]
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('products', null, {});
  }
};
