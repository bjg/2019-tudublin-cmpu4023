"use strict";
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "users", {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      details: DataTypes.HSTORE
    }, {
      paranoid: true,
      updatedAt: false,
      underscored: true
    }
  );
  Users.associate = function (models) {
    Users.hasMany(models.purchases);
  };
  return Users;
};