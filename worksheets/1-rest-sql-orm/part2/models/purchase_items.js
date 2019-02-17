module.exports = (sequelize, type) => {
    return sequelize.define('purchase_items', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // purchase_id: type.INTEGER,
        purchase_id: {
            type: type.INTEGER,
            references: {
                model: 'purchases',
                key: 'id'
            }
        },
        product_id: {
            type: type.INTEGER,
            references: {
                model: 'products',
                key: 'id'
            }
        },
        price: type.INTEGER,
        quantity: type.INTEGER,
        state: type.STRING,
    }, {
        timestamps: false
    })
}


// CREATE TABLE purchase_items (
//     id integer NOT NULL,
//     purchase_id integer,
//     product_id integer,
//     price numeric,
//     quantity integer,
//     state character varying(255)
// );