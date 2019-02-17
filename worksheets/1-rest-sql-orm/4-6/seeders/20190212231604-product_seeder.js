'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('products', [
    {
      title: 'Water',
      price: 1.99,
      tags: "{Drinks, Water}",
      created_at: new Date(),
      deleted_at: new Date()
    },
    {
      title: 'Glass',
      price: 5.99,
      tags: "{Homeware}",
      created_at: new Date(),
      deleted_at: new Date()
    },
    {
      title: 'Poster',
      price: 15.99,
      tags: "{Bob Marley, Buffalo Soldier}",
      created_at: new Date(),
      deleted_at: new Date()
    },
    {
      title: 'Tissues',
      price: 21.99,
      tags: "{Mansized, Soft}",
      created_at: new Date(),
      deleted_at: new Date()
    },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
