'use strict';
module.exports = function(sequelize, DataTypes) {
  var purchases = sequelize.define('purchases', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    timestamps: false
  });
  return purchases;
};