'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('SeqPurchases', [{
        created_at: new Date(),
        name: "JK Rowling",
        address: "4 Privet Drive",
        state: "UK",
        zipcode: 34536,
        user_id: 5
      }, {
        created_at: new Date(),
        name: "Michael Jordan",
        address: "45 23rd Avenue",
        state: "NC",
        zipcode: 45236,
        user_id: 4
      }, {
        created_at: new Date(),
        name: "Barrack Obama",
        address: "1600 Pennsylvania Ave",
        state: "DC",
        zipcode: 20500,
        user_id: 2
      }, {
        created_at: new Date(),
        name: "John Doe",
        address: "123 Main Street",
        state: "NY",
        zipcode: 30257,
        user_id: 1
      }, {
        created_at: new Date(),
        name: "Ian Brown",
        address: "Sir Matt Busby Way",
        state: "UK",
        zipcode: 65173,
        user_id: 3
      }], {});
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
