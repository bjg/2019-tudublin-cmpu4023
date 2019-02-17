'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.HSTORE,
    deleted_at: DataTypes.DATE
  }, {
    underscored: true
  });
  user.associate = function(models) {
    // User has zero to many purchases
    user.hasMany(models.purchase)
  };
  return user;
};