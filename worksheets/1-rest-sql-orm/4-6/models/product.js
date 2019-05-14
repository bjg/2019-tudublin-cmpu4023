'use strict';
module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define('product', {
    title: DataTypes.STRING,
    price: DataTypes.NUMERIC,
    deleted_at: DataTypes.DATE,
    tags: DataTypes.ARRAY(DataTypes.TEXT)
  }, {
    underscored: true
  });
  product.associate = function(models) {
    product.hasOne(models.purchase_item);
  };
  return product;
};