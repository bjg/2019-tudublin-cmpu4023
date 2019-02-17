'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    tags: DataTypes.STRING
  }, {});
  products.associate = function(models) {
    products.belongsTo(models.purchase_items)
  };
  return products;
};