'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('purchase_items', {
      id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      purchase_id: {type: Sequelize.INTEGER,
        references : { model : "purchases", key : "id"},
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      product_id: {type: Sequelize.INTEGER,
        references : { model : "products", key : "id"},
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      price: {type: Sequelize.INTEGER},
      quantity: {type: Sequelize.INTEGER},
      state: {type: Sequelize.STRING},
      createdAt: {allowNull: false, type: Sequelize.DATE},
      updatedAt: {allowNull: false, type: Sequelize.DATE}
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('purchase_items');
  }
};

