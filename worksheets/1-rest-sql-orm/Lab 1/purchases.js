'use strict';
module.exports = function(sequelize, DataTypes){
    var purchases = sequelize.define('purchases', {
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        state: DataTypes.STRING,
        zipcode: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        createdAt: {
            type: DataTypes.DATE,
            field: "created_at"
        },
    }, {
        timestamps:false
    }, {
        classMethods: { 
            associate:function(models){
                purchases.belongsTo(models.users, {foreignKey: 'user_id'});
            }
        }
    });
    return purchases;
};