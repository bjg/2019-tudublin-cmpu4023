'use strict';
module.exports = function(sequelize, DataTypes) {
  var products = sequelize.define('products', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    title: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    tags: DataTypes.JSON
  }, {
      timestamps: false
  });
  return products;
};