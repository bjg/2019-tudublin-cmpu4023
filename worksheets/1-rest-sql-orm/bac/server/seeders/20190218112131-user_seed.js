'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users_Sequelizes', [{
        email: 'user1@gmail.com',
        password: 'pass',
        details: 'testUser',
      }], {});
    },
  
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users_Sequelizes', null, {});
  
    }
  };
  
