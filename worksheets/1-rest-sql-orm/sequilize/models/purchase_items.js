'use strict';
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('purchase_items', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
	  primaryKey: true,
      autoIncrement: true,
      defaultValue: 'nextval(purchase_items_id_seq::regclass)'
    },
    purchaseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
	  field: "purchase_id",
      references: {
        model: 'purchases',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
	  field: "product_id",
      references: {
        model: 'products',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DOUBLE
    },
    quantity: {
      type: DataTypes.INTEGER
    },
    state: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'purchase_items',
    timestamps: false
  });

   purchase_items.associate = function(models) {
    // associations can be defined here
  };
  return purchase_items;
}; 