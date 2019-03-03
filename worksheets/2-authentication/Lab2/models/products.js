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
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL
  }, {timestamps: false}, {
  });
  return products;
};