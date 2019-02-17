'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Sequelized_purchases', [{
      created_at: new Date(),
      name: 'Barrack Obama',
      address: '1600 Pennsylvania Ave NW',
      state: 'DC',
      zipcode: 42114,
      user_id: 4
    },
    {
      created_at: new Date(),
      name: 'Patrick Baker',
      address: '1640  Sweetwood Drive',
      state: 'CO',
      zipcode: 80202,
      user_id: 1
    },
    {
      created_at: new Date(),
      name: 'Leslie Biggs',
      address: '4940  New Creek Road',
      state: 'AL',
      zipcode: 35816,
      user_id: 3
    },
    {
      created_at: new Date(),
      name: 'Margret Thatcher',
      address: '1029  Martha Ellen Drive',
      state: 'NV',
      zipcode: 89445,
      user_id: 2
    },
    {
      created_at: new Date(),
      name: 'Deandra Reynolds',
      address: '1816  Hiddenview Drive',
      state: 'PA',
      zipcode: 19108,
      user_id: 5
    },], {});
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
