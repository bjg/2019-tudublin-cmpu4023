'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('purchase_items', 'updated_at', Sequelize.DATE),
      queryInterface.addColumn('purchase_items', 'created_at', Sequelize.DATE),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('purchase_items', 'updated_at'),
      queryInterface.addColumn('purchase_items', 'created_at'),
    ])
  }
};