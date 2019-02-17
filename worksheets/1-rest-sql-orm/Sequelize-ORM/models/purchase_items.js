'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchase_items = sequelize.define('purchase_items', {
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING,
    updated_at: DataTypes.DATE
  }, {
    underscored: true,
  });
  purchase_items.associate = function(models) {
    // associations can be defined here
  };
  return purchase_items;
};