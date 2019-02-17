'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('purchases', {
    id: {type: DataTypes.INTEGER,
         primaryKey: true },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {timestamps: false});
  purchases.associate = function(models) {
    purchases.belongsTo(models.products);
  };
  return purchases;
};
