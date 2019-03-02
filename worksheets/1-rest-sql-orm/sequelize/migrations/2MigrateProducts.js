'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('products', {
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
      created_at: {
		allowNull: false,
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
    return queryInterface.dropTable('products');
  }
};
