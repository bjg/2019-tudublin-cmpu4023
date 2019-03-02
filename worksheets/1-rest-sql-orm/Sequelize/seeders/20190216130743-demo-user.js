'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', [{
              email: 'Paul22@test.com',
              password: 'abcdef3efgh',
              created_at: new Date()
            }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { where: { email: 'Paul22@test.com' } }, {});
  }
};