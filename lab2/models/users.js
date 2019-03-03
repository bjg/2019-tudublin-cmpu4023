'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true
    },
    email: DataTypes.STRING,
    details: DataTypes.STRING
  }, {timestamps: false});
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};
