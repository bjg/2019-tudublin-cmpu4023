'use strict';
module.exports = (sequelize, DataTypes) => {
  const productstable = sequelize.define('productstable', {
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    tags: DataTypes.ARRAY(DataTypes.STRING)
  }, {});
  productstable.associate = function(models) {
    // associations can be defined here
    productstable.hasMany(models.purchase_itemst);
  };
  return productstable;
};