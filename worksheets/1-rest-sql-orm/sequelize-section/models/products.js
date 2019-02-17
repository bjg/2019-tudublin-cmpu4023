'use strict';
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('products', {
    id: {type: DataTypes.INTEGER, primaryKey: true},
    title: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    createdAt: {type:DataTypes.DATE, field: "created_at"},
    deletedAt: {type:DataTypes.DATE, field: "deleted_at"},
    tags: DataTypes.ARRAY(DataTypes.TEXT)
  },
  {
    // Required as part to remove the defaulted "createdAt" and
    // "updatedAt columns set by Sequelize"
    timestamps: false
  });

  Products.associate = models => {
    Products.hasMany(models.purchase_items, {
      foreignKey: "productId",
      constraints: true
    });
  };
  return Products;
};