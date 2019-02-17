'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('purchases', {
    id: {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
      allowNull: false
    },
    createdAt: {
      type : Date(),
      field: "created_at"
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  // purchases.associate = function(models) {
  //   // associations can be defined here
  //   models.purchases.belongsTo(models.Users, {
  //     foreignKey: 'user_id'
  //   });

  //   models.purchases.hasMany(models.purchases_items, {
  //     foreignKey: 'purchase_id'
  //   });
  // };

  return purchases;
};