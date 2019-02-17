'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases_items = sequelize.define('purchases_items', {
    id: {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
      allowNull: false
    },
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {});
  // purchases_items.associate = function(models) {
  //   // associations can be defined here
  // };
  return purchases_items;
};