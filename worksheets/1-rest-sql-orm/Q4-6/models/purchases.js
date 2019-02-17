'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('purchases', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		unique: true
	},
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER
    //user_id: DataTypes.INTEGER
  }, {timestamps: false});
  return purchases;
};