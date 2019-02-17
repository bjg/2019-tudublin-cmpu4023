'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.STRING,
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {});
  user.associate = function(models) {
    user.belongsTo(models.purchases)
  };
  return user;
};