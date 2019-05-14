'use strict';
module.exports = (sequelize, DataTypes) => {
  const PurchaseItems = sequelize.define('purchase_items', {
    id: {type: DataTypes.INTEGER, primaryKey: true},
    purchaseId: {type: DataTypes.INTEGER, field: "purchase_id"},
    productId: {type: DataTypes.INTEGER, field: "product_id"},
    price: DataTypes.DOUBLE,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  },
  {
    // Required as part to remove the defaulted "createdAt" and
    // "updatedAt columns set by Sequelize"
    timestamps: false
  });

  PurchaseItems.associate = models => {
    PurchaseItems.belongsTo(models.purchases, {
      foreignKey: "purchaseId",
      constraints: true
    });
    PurchaseItems.belongsTo(models.products, {
      foreignKey: "productId",
      constraints: true
    });
  };
  return PurchaseItems;
};