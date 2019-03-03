'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    id: {type: DataTypes.INTEGER,
         primaryKey: true },
    price: DataTypes.INTEGER,
    tags: DataTypes.STRING,
    title: DataTypes.STRING
  }, {timestamps: false});
  products.associate = function(models) {
    
  };
  return products;
};
