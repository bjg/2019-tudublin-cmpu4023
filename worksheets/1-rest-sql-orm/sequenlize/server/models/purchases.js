'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('purchases', {
    created_at: DataTypes.DATE,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, { });
  purchases.associate = function(models) {
    // associations can be defined here
      purchases.hasMany(models.purchases_items, { onDelete: 'CASCADE' });
  };
  return purchases;
};