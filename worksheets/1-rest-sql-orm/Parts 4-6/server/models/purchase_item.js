'use strict';
module.exports = function(sequelize, DataTypes) {
  var purchase_item = sequelize.define('purchase_item', {
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING,
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
  }, {
      paranoid: false,
      updatedAt: false,
      underscored: true
  },{
    classMethods: {
      associate: function(models) {
        purchase_item.belongsTo(models.purchase);
        purchase_item.belongsTo(models.product);
      }
    }
  });
  return purchase_item;
};