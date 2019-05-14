'use strict';
module.exports = (sequelize, DataTypes) => {
  const seqProduct = sequelize.define('seqProduct', {
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    created_at:DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {});
  seqProduct.associate = function(models) {
    // associations can be defined here
    seqProduct.hasMany(models.seqPurchase_Item);
  };
  return seqProduct;
};