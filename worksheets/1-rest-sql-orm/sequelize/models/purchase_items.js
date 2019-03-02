'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchase_items = sequelize.define('purchase_items', {
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {timestamps: false});
  purchase_items.associate = function(models) {
	purchase_items.hasMany(models.purchases, { foreignKey: 'purchase_id' })
	purchase_items.hasMany(models.products, { foreignKey: 'product_id' })
  };
  return purchase_items;
};