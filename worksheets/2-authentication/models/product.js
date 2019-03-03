'use strict';
module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define('product', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    cost: DataTypes.FLOAT
  }, {});
  product.associate = function(models) {
    // associations can be defined here
  };
  return product;
};
