'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, field: "id"},
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.JSON,
    createdAt: {type:DataTypes.DATE, field: "created_at"},
    deletedAt: {type:DataTypes.DATE, field: "deleted_at"}
  }, 
  {
    // Required as part to remove the defaulted "createdAt" and
    // "updatedAt columns set by Sequelize"
    timestamps: false
  });

  Users.associate = models => {
    Users.hasMany(models.purchases, {
      foreignKey: "userId",
      constraints: true
    });
  };
  return Users;
};