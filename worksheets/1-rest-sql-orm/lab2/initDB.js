const Seq = require('sequelize')

const sequelize = new Seq({
    username: 'admin1',
    password: 'password',
    database: 'pgguide',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: {
        underscored: true,
        timestamps: false,
    }
})

const Product = sequelize.define('product', {
    id: {
        type: Seq.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Seq.STRING,
    },
    price: {
        type: Seq.NUMERIC,
    },
    created_at: {
        type: Seq.DATE,
    },
    deleted_at: {
        type: Seq.DATE,
    },
    tags: {
        type: Seq.ARRAY(Seq.STRING),
    }
})

module.exports = {
    sequelize,
    Product,
}
