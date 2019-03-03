'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    accesskey: DataTypes.STRING,
    secretkey: DataTypes.STRING
  }, {
    underscored: true
  });
  user.associate = function(models) {
  };
  return user;
};