'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('seqPurchase_Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.FLOAT
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      state: {
        type: Sequelize.STRING,
        defaultValue: "Pending"
      },
      seqProductId:{
        allowNull:false,
        type: Sequelize.INTEGER
      },
      seqPurchasesId:{
        allowNull:false,
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('seqPurchase_Items');
  }
};