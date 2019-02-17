'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('purchases', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    zipcode: DataTypes.INTEGER
  }, {});
  purchases.associate = function(models) {
    // associations can be defined here
	purchases.belongsTo(models.products);
  };
  return purchases;
};