'use strict';
module.exports = function(sequelize, DataTypes) {
  var purchase_items = sequelize.define('purchase_items', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    price: DataTypes.DECIMAL,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {
    timestamps: false
  });
  return purchase_items;
};