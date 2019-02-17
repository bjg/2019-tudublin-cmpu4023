module.exports = (sequelize, type) => {
    return sequelize.define('products', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: type.STRING,
        price: type.INTEGER,
        tags:  type.ARRAY(type.STRING),
    }, {
        timestamps: false
    })
}

// CREATE TABLE products (
//     id integer NOT NULL,
//     title character varying(255),
//     price numeric,
//     created_at timestamp with time zone,
//     deleted_at timestamp with time zone,
//     tags character varying(255)[]
// );