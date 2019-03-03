'use strict';
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('products', {
    title: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    createdAt: {
      type : Date(),
      field: "created_at"
    },
    deletedAt: {
      type:Date(),
      field: "deleted_at"
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    }
  }, {
    timestamps: false
  });
  Products.associate = function(models) {
    // associations can be defined here
  };
  return Products;
};