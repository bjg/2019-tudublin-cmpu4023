'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
      allowNull: false
    },
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
  // users.associate = function(models) {
  //   // associations can be defined here
  //   models.users.hasMany(models.users, {
  //     foreignKey: 'user_id'
  //   });
  // };
  return users;
};