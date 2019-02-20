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
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.DOUBLE
    },
    created_at: {
      type: DataTypes.DATE
    },
    deleted_at: {
      type: DataTypes.DATE
    },
    tags: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'products',
    timestamps: false
  });

   purchase_items.associate = function(models) {
    // associations can be defined here
  };
  return products;
}; 