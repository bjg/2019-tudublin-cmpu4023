'use strict';
module.exports = (sequelize, DataTypes) => {
  const Purchases - Item = sequelize.define('Purchases-Item', {
    price: DataTypes.DECIMAL,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {});
  Purchases - Item.associate = function(models) {
    // associations can be defined here
  };
  return Purchases - Item;
};