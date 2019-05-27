//Lab 1
//purchase items model

'use strict';

module.exports = (sequelize, DataTypes) => {
    const purchase_items = sequelize.define('purchase_items', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        price: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        state: DataTypes.STRING
    }, {});

    purchase_items.associate = function(models) {
        // associations can be defined here
        purchase_items.belongsTo(models.users);
        purchase_items.belongsTo(models.purchases);
    };

    return purchase_items;

};
