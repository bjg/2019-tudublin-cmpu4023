'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert("users", [{
        id: 18,
        email: "nobleman@gmail.com",
        password: "hello0815",
        details: '"sex" => "M"',
        created_at: new Date()
      }
      ], {});
    },

    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
  }

    
};
