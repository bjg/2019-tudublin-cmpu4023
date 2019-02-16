'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    details: DataTypes.HSTORE,
    created_at: DataTypes.DATE,
    deleted_at:DataTypes.DATE,
    }, {
        paranoid: true,
        updatedAt: false,
        underscored: true
    },{
    classMethods: {
      associate: function(models) {
        user.hasMany(models.purchase);
      }
    }
  });
  return user;
};
