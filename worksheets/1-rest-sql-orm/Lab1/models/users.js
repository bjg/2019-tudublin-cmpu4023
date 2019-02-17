'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};