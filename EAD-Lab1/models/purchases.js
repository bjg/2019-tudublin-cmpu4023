'use strict';
module.exports = (sequelize, DataTypes) => {
  const purchases = sequelize.define('purchases', {
    id: {type: Sequelize.INTEGER, primaryKey:true ,allowNull: false, autoIncrement:true},
	
    name: {type: Sequelize.STRING},
    address: {type: Sequelize.STRING},
	
    state: {type: Sequelize.STRING},
	
    zipcode: {type: Sequelize.INTEGER},
	
    user_id: {type:Sequelize.INTEGER,
	references: { model: users, key:'id'}
  }});
  purchases.associate = function(models) {
    // associations can be defined here
  };
  return purchases;
};