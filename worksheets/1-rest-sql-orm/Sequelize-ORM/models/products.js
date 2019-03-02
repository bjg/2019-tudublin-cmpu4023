'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    updated_at: DataTypes.DATE
  }, {
    underscored: true,
  });
  products.associate = function(models) {
    // associations can be defined here
  };
  return products;
};