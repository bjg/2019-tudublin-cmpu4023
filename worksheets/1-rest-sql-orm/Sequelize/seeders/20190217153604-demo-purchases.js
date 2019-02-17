'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('purchases', [{
        name: 'purchase101',
        address: 'main street',
        state: 'MH',
        zipcode: 11111,
        user_id: 1,
        created_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('purchases', { where: { name: 'purchase101' } }, {});
  }
};
