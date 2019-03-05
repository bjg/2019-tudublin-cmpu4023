'use strict';
module.exports = (sequelize, DataTypes) => {
  const Products_Sequelize = sequelize.define('Products_Sequelize', {
    title: DataTypes.STRING,
    price: DataTypes.NUMERIC,
    tags: DataTypes.STRING
  }, {});
  Products_Sequelize.associate = function(models) {
    // associations can be defined here
    Products_Sequelize.hasMany(models.PurchaseItems_Sequelize);
  };
  return Products_Sequelize;
};