'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    /*id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},*/
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.HSTORE
  }, {underscored: true});
  users.associate = function(models) {
	users.hasMany(models.purchases, {foreignKey: "user_id", sourceKey: "id"});
  };
  return users;
};

