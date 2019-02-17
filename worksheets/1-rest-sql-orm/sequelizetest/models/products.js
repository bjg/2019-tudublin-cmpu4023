'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    tags: DataTypes.STRING
  }, {});
  products.associate = function(models) {
    // associations can be defined here
	products.belongsToMany(models.purchased_items,{foreignKey:"id"})
  };
  return products;
};