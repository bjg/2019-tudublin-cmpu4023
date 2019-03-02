'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.STRING,
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {});
  users.associate = function(models) {
    // associations can be defined here
	user.hasMany(models.purchases,{foreignKey:"id"});
  };
  return users;
};