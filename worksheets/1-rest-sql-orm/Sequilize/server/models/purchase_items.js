'use strict';
module.exports = (sequelize, DataTypes) => {
  const Purchases_items = sequelize.define('purchases_items', {
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {});
  Purchases_items.associate = function(models) {
    // associations can be defined here
  };
  return Purchases_items;
};