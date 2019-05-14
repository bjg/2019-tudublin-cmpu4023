'use strict';
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'products',
    timestamps: false
  });
  
  purchase_items.associate = function(models) {
    // associations can be defined here
  };
  return purchase_items;
};