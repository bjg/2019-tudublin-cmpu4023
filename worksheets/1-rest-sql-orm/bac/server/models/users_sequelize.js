'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users_Sequelize = sequelize.define('Users_Sequelize', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.STRING
  }, {});
  Users_Sequelize.associate = function(models) {
    // associations can be defined here
    Users_Sequelize.hasMany(models.Purchases_Sequelize)
  };
  return Users_Sequelize;
};