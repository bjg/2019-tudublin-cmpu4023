'use strict';

module.exports = {
  
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('users', [{
        id: 2001,
        email: 'gg@gg.com',
        password: '7a1c8d1d150d75da48efbd03f388472d',
        details: '"sex"=>"M"',
        created_at: new Date()
        
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkDelete('users', { where: { email: 'gg@gg.com' } }, {});
  }
};

