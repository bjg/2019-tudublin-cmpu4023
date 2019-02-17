'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('purchases', [
        {
          id: 1,
          name: 'Clark Kent',
          address: 'Kent Farm',
          state: 'Kansas',
          zipcode: 12345,
          user_id: 1,
          created_at: '2009-03-08 03:06:00+00',
          createdAt: '2009-03-08 03:06:00+00',
          updatedAt: '2009-03-08 03:06:00+00'
        },
        {
          id: 2,
          name: 'Bruce Wayne',
          address: 'The Palisades',
          state: 'Gotham',
          zipcode: 678910,
          user_id: 2,
          created_at: '2010-11-12 21:27:00+00',
          createdAt: '2010-11-12 21:27:00+00',
          updatedAt: '2010-11-12 21:27:00+00'
        },
        {
          id: 3,
          name: 'Diana Prince',
          address: 'Themyscira',
          state: 'Somewhere',
          zipcode: 987654321,
          user_id: 3,
          created_at: '2009-12-20 20:36:00+00',
          createdAt: '2009-12-20 20:36:00+00',
          updatedAt: '2009-12-20 20:36:00+00'
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('purchases', null, {});
  }
};
