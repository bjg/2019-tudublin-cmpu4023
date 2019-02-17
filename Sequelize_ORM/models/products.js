'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('Sequelized_products', {
    id: {
      allowNull: false,
      autoIncremenet: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: DataTypes.STRING,
    price: {
      type: DataTypes.STRING,
      validate: {
        isDecimal: true
      }
    },
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    tags: DataTypes.ARRAY(DataTypes.STRING)
  }, {});
  products.associate = function(models) {

  };
  return products;
};