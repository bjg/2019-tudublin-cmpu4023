'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    var today = new Date();
      return queryInterface.bulkInsert('users', [
        {
          email: 'jdoe@gmail.com',
          password: 'homer',
          created_at: today,
          details: '"sex"=>"M", "state"=>"Illinois"'
        },
        {
          email: 'hidey@gmail.com',
          password: 'banana',
          created_at: today,
          details: '"sex"=>"F", "state"=>"Maryland"'
        }
      ], {});
  },
  down: (queryInterface, Sequelize) =>{
      return queryInterface.bulkDelete('users', {
        email: [
          'jdoe@gmail.com',
          'hidey@gmail.com'
        ]
      });
  }
};

