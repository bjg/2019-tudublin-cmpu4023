'use strict';
module.exports = (sequelize, DataTypes) => {
  const userst = sequelize.define('userst', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.STRING
  }, {});
  userst.associate = function(models) {
    // associations can be defined here
    userst.hasMany(models.purchaset);

  };
  return userst;
};