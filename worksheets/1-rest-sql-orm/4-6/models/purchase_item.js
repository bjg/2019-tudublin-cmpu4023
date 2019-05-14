'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchase_item = sequelize.define('purchase_item', {
    price: DataTypes.NUMERIC,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {
    underscored: true
  });
  purchase_item.associate = function(models) {
    purchase_item.belongsTo(models.product);
    purchase_item.belongsTo(models.purchase);
  };
  return purchase_item;
};