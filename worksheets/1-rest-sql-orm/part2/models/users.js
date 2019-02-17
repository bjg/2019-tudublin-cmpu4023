module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: type.STRING,
        password: type.STRING,
        details: type.HSTORE

    }, {
        timestamps: false
    })
}

// CREATE TABLE users (
//     id integer NOT NULL,
//     email character varying(255),
//     password character varying(255),
//     details hstore,
//     created_at timestamp with time zone,
//     deleted_at timestamp with time zone
// );
