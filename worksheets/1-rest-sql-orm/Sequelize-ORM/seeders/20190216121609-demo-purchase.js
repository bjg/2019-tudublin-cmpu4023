'use strict';

module.exports = {
  
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('purchases', [{
      created_at: new Date(),
      name: 'Gabriel',
      address: 'Some Address',
      state: 'WA',
      zipcode: 90215,
      user_id: 2000
        
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkDelete('purchases', { where: { name: 'Gabriel' } }, {});
  }
  
};
