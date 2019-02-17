'use strict';

module.exports = {
  
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('products', [{
      id: 25,
      title: 'Playstation8',
      price: 399.99,
      created_at: new Date(),
      tags: '{"Console", "Games"}',
      updated_at: new Date()
    }], {});
  
  },

  down: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkDelete('products', { where: { title: 'Playstation8' } }, {});
  
  }

};
