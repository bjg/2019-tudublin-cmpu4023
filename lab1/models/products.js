'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    tags: DataTypes.STRING
  }, {timestamps: false,});
  products.associate = function(models) {
    // associations can be defined here
  };
  return products;
};