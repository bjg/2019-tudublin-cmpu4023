'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('Products', {
    title: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    tags: DataTypes.STRING
  }, { });
  products.associate = function(models) {
    // associations can be defined here
      products.hasMany(models.purchases_items);
  };
  return products;
};