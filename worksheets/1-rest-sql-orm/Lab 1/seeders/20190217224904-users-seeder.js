'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    var today = new Date();
    return queryInterface.bulkInsert('users', [
      {
        email: 'Kmbappe@gmail.com',
        password: 'P$G',
        created_at: today,
        details: ' "sex"=>"M", "state"=>"Paris"'
      },
      {
        email: 'Agriezman@gmail.com',
        password: 'goalazo',
        created_at: today,
        details: ' "sex"=>"M", "state"=>"Madrid"'
      },
      {
        email: 'Sarahsloan@gmail.com',
        password: 'sugarmoney',
        created_at: today,
        details: ' "sex"=>"F", "state"=>"Illinois"'
      }
    ],{});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('users', {
     email: [
       'Kmbappe@gmail.com',
       'Agriezman@gmail.com',
       'Sarahsloan@gmail.com'
     ]
   })
  }
};
