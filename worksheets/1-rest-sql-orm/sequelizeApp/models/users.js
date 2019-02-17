'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    created_at: DataTypes.TIME,
    deleted_at: DataTypes.TIME
  }, {});
  users.associate = function(models) {
    users.hasMany(models.purchases);
  };
  return users;
};