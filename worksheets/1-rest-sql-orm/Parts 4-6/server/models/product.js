'use strict';
module.exports = function(sequelize, DataTypes) {
  var product = sequelize.define('product', {
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    deleted_at: {
      type: new Date(),
      field: "deleted_at"
    },
    created_at: {
      type: new Date(),
      field: "created_at"
    },
  }, {
      paranoid: true,
      updatedAt: false,
      underscored: true
  }, {
    classMethods: {
      associate: function(models) {
        product.hasMany(models.purchase_item);
      }
    }
  });
  return product;
};