'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Purchases_Sequelizes', [{
      name: 'Slawek',
      address: 'Howth, Dublin',
      state: 'Leinster',
      zipcode: 50020,
      users_SequelizeID: 1
    }])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Purchases_Sequelizes', null, {});
  }
};
