'use strict';
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
    title: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    tags: DataTypes.ARRAY(DataTypes.STRING)
  }, {});
  Products.associate = function(models) {
    // associations can be defined here
  };
  return Products;
};