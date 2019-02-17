'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('Users', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.STRING,
    deleted_at: DataTypes.DATE
  }, {});
  users.associate = function(models) {
    // associations can be defined here

  };
  return users;
};