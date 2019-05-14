'use strict'

module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define('products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
        },
        title: {
            type: DataTypes.STRING,
            required: true
        },
        price: {
            type: DataTypes.FLOAT,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        tags: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        paranoid: true,
        underscored: true
    });

    return Products;
};