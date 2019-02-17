'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('purchases', {
    id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  purchases.associate = function(models) {
    // associations can be defined here
  };
  return purchases;
};