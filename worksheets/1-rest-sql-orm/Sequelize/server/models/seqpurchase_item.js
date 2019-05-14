'use strict';
module.exports = (sequelize, DataTypes) => {
  const seqPurchase_Item = sequelize.define('seqPurchase_Item', {
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING,
    seqPurchaseId:DataTypes.INTEGER,
    seqProductId:DataTypes.INTEGER
  }, {});
  seqPurchase_Item.associate = function(models) {
    seqPurchase_Item.belongsTo(models.seqProduct);
    seqPurchase_Item.belongsTo(models.seqPurchase);
  };
  return seqPurchase_Item;
};