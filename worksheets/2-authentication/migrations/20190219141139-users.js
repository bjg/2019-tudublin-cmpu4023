'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION pgcrypto;')
    .then(() => {
      queryInterface.createTable('users', {
        id: {
          allowNull:false,
          autoIncrement:true,
          primaryKey:true,
          type:Sequelize.INTEGER
        },
        username:{
          type:Sequelize.STRING
        },
        accesskey:{
          type:Sequelize.STRING(32)
        },
        secretkey: {
          type:Sequelize.STRING(56)
        },
        password:{
          type: Sequelize.STRING
        },
        created_at:{
          type: Sequelize.DATE
        },
        updated_at:{
          type: Sequelize.DATE
        }
      });
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
