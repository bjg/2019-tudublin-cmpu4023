'use strict';
module.exports = (sequelize, DataTypes) => {
  const SeqPurchases = sequelize.define('SeqPurchases', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: DataTypes.DATE,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.CHAR(2),
    zipcode: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    timestamps: false
  });
  SeqPurchases.associate = function(models) {
    SeqPurchases.belongsTo(models.SeqUsers, {
      foreignKey: 'user_id'
    });
  };
  return SeqPurchases;
};