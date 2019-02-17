'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('Sequelized_users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.HSTORE,
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {});
  users.associate = function(models) {

  };
  return users;
};