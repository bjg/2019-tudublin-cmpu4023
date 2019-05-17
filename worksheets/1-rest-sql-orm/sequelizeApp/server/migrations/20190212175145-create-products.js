'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SeqProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL
      },
      created_at: {
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('SeqProducts');
  }
};