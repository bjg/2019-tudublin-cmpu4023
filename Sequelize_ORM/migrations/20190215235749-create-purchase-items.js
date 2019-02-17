'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sequelized_purchase_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      purchase_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "purchases",
          key: "id"
        }
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "products",
          key: "id"
        }
      },
      price: {
        type: Sequelize.STRING,
        validate: {
          isDecimal: true
        }
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      state: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Sequelized_purchase_items');
  }
};