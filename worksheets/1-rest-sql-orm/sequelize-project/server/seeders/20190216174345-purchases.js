'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('purchases', [{
      name: 'John Doe',
      address: '123 Example Street',
      state: 'EG',
      zipcode: 12,
      user_id: 1
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('purchases', null, {});
  }
};
