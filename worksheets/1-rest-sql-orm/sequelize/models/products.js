'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    tags: DataTypes.ARRAY(DataTypes.STRING)
  }, {underscored: true, updatedAt: 'deleted_at'});
  products.associate = function(models) {
  };
  return products;
};

