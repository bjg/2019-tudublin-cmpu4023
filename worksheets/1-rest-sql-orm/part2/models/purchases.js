module.exports = (sequelize, type) => {
    const Purchases = sequelize.define('purchases', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        address: type.STRING,
        state: type.STRING,
        zipcode: type.INTEGER,
        user_id: {
            type: type.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
    }, {
        timestamps: false
    })

    return Purchases
}


// CREATE TABLE purchases (
//     id integer NOT NULL,
//     created_at timestamp with time zone,
//     name character varying(255),
//     address character varying(255),
//     state character varying(2),
//     zipcode integer,
//     user_id integer
// );