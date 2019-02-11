'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.JSON
  }, {
    timestamps: false
  });
  return users;
};