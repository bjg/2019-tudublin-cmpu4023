'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      details: {
        type: Sequelize.HSTORE
      },
      created_at: {
        type:Sequelize.DATE,
        field: "created_at"
      },
      deleted_at: {
        type:Sequelize.DATE,
        field: "deleted_at"
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
