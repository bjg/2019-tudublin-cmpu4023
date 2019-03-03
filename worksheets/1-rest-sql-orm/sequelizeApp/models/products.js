'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },      
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    created_at: DataTypes.TIME,
    deleted_at: DataTypes.TIME,
    tags: DataTypes.STRING
  }, {
    timestamps: false
  });
  products.associate = function(models) {
    products.hasMany(models.purchase_items);
  };
  return products;
};