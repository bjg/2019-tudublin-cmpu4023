'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    id: 
	{
		type: DataTypes.INTEGER,
		primaryKey: true,
		unique: true,
		allowNull: false,
		autoIncrement: true
	},
    title: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    tags: DataTypes.ARRAY(DataTypes.STRING),
	created_at: DataTypes.DATE
  }, {timestamps: false});
  products.associate = models => {
    products.hasMany(models.purchase_items, {
      foreignKey: 'product_id'
    })
  };
  return products;
};