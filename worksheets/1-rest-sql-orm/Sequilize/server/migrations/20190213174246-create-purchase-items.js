'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('purchase_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      purchase_id: {
        type: Sequelize.INTEGER,
        references:{
          model: 'purchases',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      product_id: {
        type: Sequelize.INTEGER,
        references:{
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Purchases_items');
  }
};