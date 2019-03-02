'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchase_items = sequelize.define('purchase_items', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		unique: true
	},
	purchase_id:DataTypes.INTEGER,
	product_id:DataTypes.INTEGER,
    price: DataTypes.NUMERIC,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {timestamps: false},
	  {
    classMethods: {
      associate: function(models) {
        purchase_items.belongsTo(models.purchases, {foreignKey: 'purchase_id'});
        purchase_items.belongsTo(models.products, {foreignKey: 'product_id'});
      }
    }
  });
  return purchase_items;
};