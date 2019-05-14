'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('seqProducts', {
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
        type: Sequelize.FLOAT
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE,
        default:Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('seqProducts');
  }
};