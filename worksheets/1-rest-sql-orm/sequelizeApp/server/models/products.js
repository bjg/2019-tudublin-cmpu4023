'use strict';
module.exports = (sequelize, DataTypes) => {
  const SeqProducts = sequelize.define('SeqProducts', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    created_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    tags: DataTypes.ARRAY(DataTypes.STRING)
  }, {});
  SeqProducts.associate = function(models) {
    
  };
  return SeqProducts;
};