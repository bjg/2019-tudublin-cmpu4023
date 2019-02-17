'use strict';
module.exports = (sequelize, DataTypes) => {
  const SeqPurchaseItems = sequelize.define('SeqPurchaseItems', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {
    timestamps: false
  });
  SeqPurchaseItems.associate = function(models) {
    SeqPurchaseItems.belongsTo(models.SeqPurchases, {
      foreignKey: 'purchase_id'
    });
    SeqPurchaseItems.belongsTo(models.SeqProducts, {
      foreignKey: 'product_id'
    });
  };
  return SeqPurchaseItems;
};