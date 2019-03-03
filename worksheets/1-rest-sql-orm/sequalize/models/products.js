'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    title: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    tags: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    paranoid: true,
    updatedAt: false,
    underscored: true
  });
  products.associate = function (models) {
    // associations can be defined here
    products.hasMany(models.purchase_items);
  };
  return products;
};