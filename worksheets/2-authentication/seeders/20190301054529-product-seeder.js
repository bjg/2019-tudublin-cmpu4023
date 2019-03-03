'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('products', [
      {
        name: 'Biscuits',
        cost: 1.99,
        category: "food",
        created_at: new Date(),
      },
      {
        name: 'Chicken',
        cost: 5.99,
        category: "food",
        created_at: new Date(),
      },
      {
        name: 'Burrito',
        cost: 5.99,
        category: "food",
        created_at: new Date(),
      },
      {
        name: 'Desk',
        cost: 149.99,
        category: "appliance",
        created_at: new Date(),
      },
      {
        name: 'Chair',
        cost: 99.99,
        category: "appliance",
        created_at: new Date(),
      },
      {
        name: 'Chelsea vs Arsenal',
        cost: 49.99,
        category: "tickets",
        created_at: new Date(),
      },
      {
        name: 'Bob Marlay Live',
        cost: 149.99,
        category: "tickets",
        created_at: new Date(),
      },
      {
        name: 'Frank Sinatra Live',
        cost: 129.99,
        category: "tickets",
        created_at: new Date(),
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