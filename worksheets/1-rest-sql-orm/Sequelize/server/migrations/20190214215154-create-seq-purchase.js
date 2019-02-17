'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('seqPurchases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      created_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue:Sequelize.NOW
      },
      seqUserId:{
        allowNull:false,
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('seqPurchases');
  }
};