'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    id: {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
      allowNull: false
    },
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
    tags: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    timestamps: false
  });

  // products.associate = function(models) {
  //   models.products.hasMany(models.purchases_items, {
  //     foreignKey: 'product_id'
  //   })
  // };

  return products;
};