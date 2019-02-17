module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('users', {
        email: DataTypes.STRING,
        details: DataTypes.HSTORE
    }, {
        timestamps: false
    });
    Users.associate = function(models) {
        // associations can be defined here
    };
    return Users;
};