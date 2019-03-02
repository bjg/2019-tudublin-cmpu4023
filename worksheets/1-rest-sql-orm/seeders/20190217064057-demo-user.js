'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', [
      {
        email: 'superman@gmail.com',
        password: 'clark123',
        details: 'male',
        created_at: '2009-03-08 03:06:00+00',
        deleted_at: null,
        createdAt: '2009-03-08 03:06:00+00',
        updatedAt: '2009-03-08 03:06:00+00',
      },
      {
        email: 'batman@yahoo.com',
        password: 'bruce456',
        details: 'male',
        created_at: '2010-11-12 21:27:00+00',
        deleted_at: null,
        createdAt: '2010-11-12 21:27:00+00',
        updatedAt: '2010-11-12 21:27:00+00'
      },
      {
        email: 'wonderwoman@outlook.ie',
        password: 'diana789',
        details: 'female',
        created_at: '2009-12-20 20:36:00+00',
        deleted_at: null,
        createdAt: '2009-12-20 20:36:00+00',
        updatedAt: '2009-12-20 20:36:00+00'
      },], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
  }
};
