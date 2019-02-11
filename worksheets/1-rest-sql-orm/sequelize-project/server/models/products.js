'use strict';
module.exports = function(sequelize, DataTypes) {
  var products = sequelize.define('products', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    title: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    tags: DataTypes.JSON
  }, {
      timestamps: false
  });

  products.associate = models => {
    products.hasMany(models.purchase_items, {
      foreignKey: 'product_id'
    })
  }

  return products;
};