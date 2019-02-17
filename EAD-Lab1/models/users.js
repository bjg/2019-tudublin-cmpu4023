'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {type:Sequelize.INTEGER, primaryKey:true, allowNull:false, autoIncrement:true}, 
    email: {type: Sequelize.STRING}, 
    password:{type: Sequelize.STRING},
    details: {type: Sequelize.HSTORE}
  });
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};