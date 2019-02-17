'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		unique: true
	},
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.STRING
  }, {timestamps: false});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};