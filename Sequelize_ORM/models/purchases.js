'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('Sequelized_purchases', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    created_at: DataTypes.DATE,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: {
      type: DataTypes.STRING(2)
    },
    zipcode: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  purchases.associate = function(models) {
    
  };
  return purchases;
};