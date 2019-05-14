'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
      },
    title: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {});
  products.associate = function(models) {
    // associations can be defined here
  };
  return products;
};