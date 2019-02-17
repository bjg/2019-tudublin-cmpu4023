const express = require('express')
const app = express();
const port = 3000;
const Seq = require('sequelize')
let conn = require('./conn.json');
const models = require('./models')


const sequelize = new Seq({
    username: conn.user,
    password: conn.password,
    database: conn.database,
    host: conn.host,
    dialect: 'postgres',
    define: {
        underscored: true,
        timestamps: false,
    }
})

// models.users.create({
//       id: 73,
//       email: 'mushy@mydit.ie',
//       password: '123123123',
//       details: '"sex"=>"M"'
// });
// models.products.create({
//     id: 66,
//     title: 'OnePlus 5T',
//     price: '450.00',
//     tags: ['Technology']
// });
// models.purchases.create({
//     name: 'Mike Smith',
//     address: '15 Collins Ave. ',
//     state: "AA",
//     zipcode:45346,
//     user_id: 73
// });
// models.purchase_items.create({
//     purchase_id: 1001,
//     product_id:66,
//     price: '500',
//     quantity: 1,
//     state: "Delivered"
// });

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');

    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


//List all products
app.get('/products', (req, res) => {
    var product = req.query.prodname;

    if (product) {
        models.products.findAll({
            where: {
                title: product
            }
        }).then(product => {
            res.send(product)
        });
    } else {
        models.products.findAll().then(products => {
            res.send(products);
        });
    }
});

//Show details of the specified products
app.get('/products/:id', (req, res) => {
    var id = req.params.id;
    models.products.findOne({ where: { id: id } }).then(product => {
        res.send(product);
    })
});


//Create a new product instance
//localhost:3000/products?title=Lemsip&price=5&tags=Medicine
app.post('/products', function (req, res) {
    var title = req.query.title;
    var price = req.query.price;
    var tags = [];
    tags.push(req.query.tags);

    models.products.create({
        title: title,
        price: price,
        tags: tags
    }).then(product => {
        res.send(product);
    })
});

//Update an existing product
//localhost:3000/products/23?price=15
app.put('/products/:id', (req, res) => {
    var id = req.params.id;
    var price = req.query.price;
    models.products.update({
        price: price,
    }, {
            where: {
                id: id
            }
        }).then(product => {
            models.products.findOne({
                where: {
                    id: id
                }
            }).then(product => {
                res.send(product);
            })
        });
});

//Remove an existing product
//localhost:3000/products/23
app.delete('/products/:id', (req, res) => {
    var id = req.params.id;
    models.products.findOne({
        where: {
            id: id
        }
    }).then(product => {
        models.products.destroy({
            where: {
                id: id
            }
        }).then(deleted => {
            if (deleted == 1) {
                res.send(product);
            } else {
                res.send("error");
            }
        })
    });

});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))