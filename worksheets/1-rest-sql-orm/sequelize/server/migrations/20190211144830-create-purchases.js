'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('purchases', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      name: {type: Sequelize.STRING},
      address: {type: Sequelize.STRING},
      state: {type: Sequelize.STRING},
      zipcode: {type: Sequelize.STRING},
      user_id: {type: Sequelize.INTEGER,
        references: {
          model : "users",
          key   : "id"
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE},
      updatedAt: { allowNull: false, type: Sequelize.DATE}
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('purchases');
  }
};


