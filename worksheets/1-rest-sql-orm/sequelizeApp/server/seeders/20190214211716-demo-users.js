'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('SeqUsers', [{
        email: 'john@doe.com',
        password: 'password',
        details: JSON.stringify({
          sex: 'M',
          state: 'New York'
        }),
        created_at: new Date()
      }, {
        email: 'barrack.obama@aol.com',
        password: 'thaPrez',
        details: JSON.stringify({
          sex: 'M',
          state: 'Hawaii'
        }),
        created_at: new Date()
      }, {
        email: 'ian.brown@gmail.com',
        password: 'thisIsTheOne',
        details: JSON.stringify({
          sex: 'M'
        }),
        created_at: new Date()
      }, {
        email: 'michaelJordan@gmail.com',
        password: 'hisAirness',
        details: JSON.stringify({
          sex: 'M',
          state: 'North Carolina'
        }),
        created_at: new Date()
      }, {
        email: 'jkRowling@pottermore.com',
        password: 'hogwarts',
        details: JSON.stringify({
          sex: 'F'
        }),
        created_at: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    //return queryInterface.bulkDelete('SeqUsers', null, {});
  }
};
