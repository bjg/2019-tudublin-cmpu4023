'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('purchases', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
      },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.STRING
  }, {});
  purchases.associate = function(models) {
    // associations can be defined here
  };
  return purchases;
};