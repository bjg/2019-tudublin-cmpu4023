'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.STRING,
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};