'use strict';
module.exports = (sequelize, DataTypes) => {
  const SeqUsers = sequelize.define('SeqUsers', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.JSON,
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {});
  SeqUsers.associate = function(models) {
  };
  return SeqUsers;
};