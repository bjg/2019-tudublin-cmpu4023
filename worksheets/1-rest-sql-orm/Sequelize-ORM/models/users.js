'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.ARRAY(DataTypes.STRING),
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    underscored: true,
  });
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};