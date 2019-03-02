/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('purchase_items', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    purchase_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'purchases',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'purchase_items',
	underscored: true,
	timestamps: false
  });
};
