'use strict';
module.exports = function(sequelize, DataTypes) {
  var products = sequelize.define('products', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: false,
      
    },
    title: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    tags: DataTypes.STRING,
    tags: DataTypes.ARRAY(DataTypes.STRING),
  }, {
    timestamps: false
  });
  return products;
};

