'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchase_items = sequelize.define('Sequelized_purchase_items', {
    id: {
      allowNull: false,
      autoIncremenet: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    price: {
      type: DataTypes.STRING,
      validate: {
        isDecimal: true
      }
    },
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {});
  purchase_items.associate = function(models) {
    // associations can be defined here
    //purchase_items.hasOne(models.Sequelized_products)
    //purchase_items.hasOne(models.Sequelized_purchases)
  };
  return purchase_items;
};