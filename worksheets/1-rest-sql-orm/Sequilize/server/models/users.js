'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.HSTORE,
    createdAt: {
      type : Date(),
      field: "created_at"
    },
    deletedAt: {
      type:Date(),
      field: "deleted_at"
    }
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};