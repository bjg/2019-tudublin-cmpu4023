'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('purchases', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    created_at: DataTypes.DATE,
    zipcode: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  purchases.associate = function(models) {
    // associations can be defined here
	purchases.belongsTo(models.users,{foreignKey:"user_id"});
  };
  return purchases;
};