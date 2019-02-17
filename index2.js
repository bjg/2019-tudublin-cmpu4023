// Express for webserver
const express = require('express');
// sequelize for database
const Sequelize = require('sequelize');

const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
const port = 3000;

const sequelize = new Sequelize('postgres://postgres:Flanker7@localhost:5432/pgguide');
// Operators
const op = Sequelize.Op;

const Users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    email: { type: Sequelize.STRING, field: 'email' },
    password: { type: Sequelize.STRING, field: 'password' },
    details: { type: Sequelize.HSTORE, field: 'details' },
    created_at: { type: Sequelize.DATE },
    deleted_at: { type: Sequelize.DATE }
}, {
    timestamps: false
});

const Products = sequelize.define('products', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    title: { type: Sequelize.STRING },
    price: { type: Sequelize.NUMERIC },
    tags: { type: Sequelize.ARRAY(Sequelize.STRING)},
    created_at: { type: Sequelize.DATE },
    deleted_at: { type: Sequelize.DATE }
}, {
    timestamps: false
});

const Purchases = sequelize.define('purchases', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    created_at: { type: Sequelize.DATE },
    name: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    state: { type: Sequelize.STRING },
    zipcode: { type: Sequelize.INTEGER },
    user_id: { type: Sequelize.INTEGER},
}, {
    timestamps: false
});

const Purchase_Items = sequelize.define('purchase_items', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    purchase_id: { type: Sequelize.INTEGER },
    product_id: { type: Sequelize.INTEGER },
    price: { type: Sequelize.NUMERIC },
    quantity: { type: Sequelize.INTEGER },
    state: { type: Sequelize.STRING }
}, {
    timestamps: false
});

// List all products
app.get('/products', (req, res, next) => {
    const name = req.query.name;

    if (name !== undefined) {
        Products.findAll({
            where: {
                title: {
                    [op.iLike]: `%${name}%`
                }
            },
            order: [
                ['price', 'ASC']
            ]
        }).then((products) => {
            res.json(products);
            res.end();
        });
    } else {
        Products.findAll({
            order: [
                ['price', 'ASC']
            ]
        }).then((products) => {
            res.json(products);
        });
    }
});

//Show details of specified products
app.get('/products/:id', (req, res, next) => {
    const id = req.params.id;

    if (id !== undefined && !isNaN(id)) {
        Products.findOne({
            where: {
                id: {
                    [op.eq]: id
                }
            }
        }).then((product) => {
            res.json(product);
            res.end();
        });
    } else {
        res.status(404);
        res.end();
    }
});

// Create new product
app.post('/products', (req, res, next) => {
    const booty = req.body;
    Products.create({
        id: sequelize.literal('DEFAULT'),
        title: booty.title,
        price: booty.price,
        tags: booty.tags,
        created_at: sequelize.literal('CURRENT_TIMESTAMP')
    }).then((product) => {
        res.json(product);
        res.end();
    });
});

// Update product
app.put('/products/:id', (req, res, next) => {
    const id = req.params.id;
    const bdy = req.body;
    Products.update({
        title: bdy.title,
        price: bdy.price,
        tags: bdy.tags
    }, {
        where: {
            id: {
                [op.eq]: id
            }
        }
    }).then((product) => {
        res.json(product);
        res.end();
    });
});

// Delete user
app.delete('/products/:id', (req, res, next) => {
    const phone = req.params.id;

    Products.destroy({
        where: {
            id: {
                [op.eq]: phone
            }
        }
    }).then((prod) => {
        res.json(prod);
        res.end();
    });
});

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
