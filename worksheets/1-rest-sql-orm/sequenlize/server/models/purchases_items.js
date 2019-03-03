'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases_items = sequelize.define('purchases_items', {
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  },);
  purchases_items.associate = function(models) {
    // associations can be defined here
      purchases_items.hasOne(models.purchases,{foreignKey:'purchase_id'});
  };
  return purchases_items;
};