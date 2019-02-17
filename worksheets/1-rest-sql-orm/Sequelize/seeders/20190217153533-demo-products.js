'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('products', [{
        title: 'television',
        price: 228.99,
        tags: '{"tv", "television"}',
        created_at: new Date(),
        updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('products', { where: { title: 'television' } }, {});
  }
};
