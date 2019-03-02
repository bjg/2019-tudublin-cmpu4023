module.exports = (sequelize, Sequelize) => {
    
    const User = require('./userModel.js')(sequelize, Sequelize);
    
    const Purchase = sequelize.define('purchases', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        name: Sequelize.STRING,
        address: Sequelize.STRING,
        state: Sequelize.STRING,
        zipCode: Sequelize.STRING
    },{
        timestamps: true,
        createdAt: 'created_at',
        paranoid: true
    });
    
    Purchase.belongsTo(User, {
        foreignKey: 'user_id',
        targetKey: 'id'
    }); 
    
    return Purchase;
}
