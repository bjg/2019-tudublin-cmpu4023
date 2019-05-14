'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('users', [
    {
      email: 'tim@example.com',
      password: 'abc123',
      details: '"sex" => "male"',
      created_at: new Date(),
      deleted_at: new Date()
    },
    {
      email: 'dave@example.com',
      password: 'dave123',
      details: '"sex" => "male"',
      created_at: new Date(),
      deleted_at: new Date()
    },
    {
      email: 'jim@example.com',
      password: 'jim123',
      details: '"sex" => "male"',
      created_at: new Date(),
      deleted_at: new Date()
    },
    {
      email: 'morris@example.com',
      password: 'mo123',
      details: '"sex" => "male"',
      created_at: new Date(),
      deleted_at: new Date()
    },
    {
      email: 'kim@example.com',
      password: 'kim123',
      details: '"sex" => "female"',
      created_at: new Date(),
      deleted_at: new Date()
    }
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
