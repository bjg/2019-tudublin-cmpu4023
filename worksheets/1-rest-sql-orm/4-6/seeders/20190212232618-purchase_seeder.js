'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('purchases', [
    {
      name: 'Dave Man',
      address: 'California Road',
      state: 'CA',
      zipcode: 209,
      user_id:1,
      created_at:new Date()
    },
    {
      name: 'Jim Manner',
      address: 'Kside Road',
      state: 'D6',
      zipcode: 16,
      user_id:2,
      created_at:new Date()
    },
    {
      name: 'Bob Marley',
      address: 'Jamica Avenue',
      state: 'K2',
      zipcode: 12,
      user_id:3,
      created_at:new Date()
    },
    {
      name: 'Tim Dart',
      address: 'Paris',
      state: 'P2',
      zipcode: 12,
      user_id:4,
      created_at:new Date()
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
