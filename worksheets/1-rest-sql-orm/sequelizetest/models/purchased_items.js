'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchased_items = sequelize.define('purchased_items', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {});
  purchased_items.associate = function(models) {
    // associations can be defined here
	purchased_items.hasOne(models.purchase,{foreignKey:"purchase_id"});
	purchased_items.hasMany(models.products,{foreignKey:"product_id"});
  };
  return purchased_items;
};