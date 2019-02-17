const Sequ = require('sequelize')

const Sequelize = new Sequ(
{
    username: 'jack',
    password: 'orbien',
    database: 'pgguide',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: 
	{
        underscored: true,
        timestamps: false,
    }
})

const Product = Sequelize.define('product', 
{
    id: 
	{
        type: Sequ.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: 
	{
        type: Sequ.STRING,
    },
    price: 
	{
        type: Sequ.NUMERIC,
    },
    created_at: 
	{
        type: Sequ.DATE,
    },
    deleted_at: 
	{
        type: Sequ.DATE,
    },
    tags: 
	{
        type: Sequ.ARRAY(Sequ.STRING),
    }
})
module.exports = 
{
    Sequelize,
    Product,
}