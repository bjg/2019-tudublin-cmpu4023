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
		allowNull: false,
        type: Sequelize.INTEGER,
		references: {
			model: 'purchases',
			key: 'id'
		}
      },
      product_id: {
		allowNull: false,
        type: Sequelize.INTEGER,
		references: {
			model: 'products',
			key: 'id'
		}
      },
      price: {
        type: Sequelize.FLOAT
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
    return queryInterface.dropTable('purchase_items');
  }
};

