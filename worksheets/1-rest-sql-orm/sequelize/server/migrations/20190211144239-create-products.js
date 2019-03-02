'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('products', {
      id: {
        allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      createdAt: {
        allowNull: false, type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: false, type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false, type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('products');
  }
};

