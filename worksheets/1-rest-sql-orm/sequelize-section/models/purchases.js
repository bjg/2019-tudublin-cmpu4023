'use strict';
module.exports = (sequelize, DataTypes) => {
  const Purchases = sequelize.define('purchases', {
    id: {type: DataTypes.INTEGER, primaryKey: true},
    createdAt: {type:DataTypes.DATE, field: "created_at"},
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    userId: {type: DataTypes.INTEGER, field: "user_id"},
  },
  {
    // Required as part to remove the defaulted "createdAt" and
    // "updatedAt columns set by Sequelize"
    timestamps: false,
  });

  Purchases.associate = models => {
    Purchases.belongsTo(models.users, {
      foreignKey: "userId",
      constraints: true
    });
    Purchases.hasMany(models.purchase_items, {
      foreignKey: "purchaseId",
      constraints: true
    });
  };

  return Purchases;
};