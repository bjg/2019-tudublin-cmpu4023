'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
	  return queryInterface.bulkInsert('users', [{
        email: 'bigman@bigemail.com',
        password: '296ca911a6fc78b4b3e75f927c16fcfd',
      }], {});
  },

  down: (queryInterface, Sequelize) => {
	  return queryInterface.bulkDelete('users', null, {});
  }
};
