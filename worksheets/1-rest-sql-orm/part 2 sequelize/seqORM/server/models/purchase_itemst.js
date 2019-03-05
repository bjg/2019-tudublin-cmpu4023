'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchase_itemst = sequelize.define('purchase_itemst', {
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {});
  purchase_itemst.associate = function(models) {
    // associations can be defined here
    purchase_itemst.belongsTo(models.purchaset);
    purchase_itemst.belongsTo(models.productstable);
  };
  return purchase_itemst;
};