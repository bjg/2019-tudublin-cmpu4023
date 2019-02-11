'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('purchase_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      state: {
        type: Sequelize.STRING
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('purchase_items');
  }
};