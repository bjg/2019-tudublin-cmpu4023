'use strict';
module.exports = (sequelize, DataTypes) => {
  const Purchases = sequelize.define('purchases', {
    createdAt: {
      type : Date(),
      field: "created_at"
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    timestamps: false
  });
  Purchases.associate = function(models) {
    // associations can be defined here
  };
  return Purchases;
};