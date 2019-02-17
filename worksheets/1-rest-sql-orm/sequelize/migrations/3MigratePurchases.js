'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('purchases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      created_at: {
		allowNull: false,
        type: Sequelize.DATE
      },
      name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      zipcode: {
        type: Sequelize.INTEGER
      },
      user_id: {
		allowNull: false,
        type: Sequelize.INTEGER,
		references: {
			model: 'users',
			key: 'id'
		}
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('purchases');
  }
};