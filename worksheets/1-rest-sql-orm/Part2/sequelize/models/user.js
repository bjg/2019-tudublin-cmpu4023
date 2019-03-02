'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.HSTORE
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};