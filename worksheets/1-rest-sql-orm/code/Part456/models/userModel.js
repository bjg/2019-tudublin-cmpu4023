module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        details: Sequelize.STRING
    },{
        timestamps: true,
        createdAt: 'created_at',
        deletedAt: 'deleted_at',
        updatedAt: false,
        paranoid: true
    });
    
    return User;
}
