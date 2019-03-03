const express = require('express')
const Users = require('./models').users;
const Products = require('./models').products;
const Purchases = require('./models').purchases;
const Purchase_Items = require('./models').purchase_items;

const app = express()
const port = 3003


//Populating database using the model and JavaScript
Products.create({
    title: 'Application Development III: Intermediate Level',
    price: 88.8,
    tags: [
        'Book',
        'Programming',
        'JavaScript'
    ]
})

Users.create({
    email: 'raul@email.com',
    password: 'myPassword',
    details: {
        sex: 'M'
    }
}).then(user => {
    user.createPurchase({
        name: 'Adell Pressey',
        address: '1552 12th Street',
        state: 'NY',
        zipcode: 67293

    }).then(purchase => {

        purchase.createPurchase_item({
            product_id: 8,
            price: 8.88,
            quantity: 2,
            state: 'Delivered'

        })
    })
})



app.get('/', (req, res) => res.send('Hello World!'))

//GET /products[?name=string]
app.get('/products', (req, res) => {

    if (req.query.name) {
        Products.findAll({
            where: {
                title: req.query.name
            }
        }).then(product => res.json(product))

    } else {
        Products.findAll().then(products => {
            res.json(products)
        })
    }
})

//GET /products/:id
app.get('/products/:id', (req, res) => {
    Products.findOne({
        where: {
            id: req.params.id
        }
    }).then(products => {
        res.json(products)
    })
})

//POST /products
app.post('/products', (req, res) => {

    console.log(req.query.tags);
    const title = req.query.title;
    const price = req.query.price;
    const tags = req.query.tags;

    Products.create({
        title: title,
        price: price,
        tags: tags
    }).then(product => res.json(product))
})

//PUT /products/:id
app.put('/products/:id', (req, res) => {

    const updatedAttr = req.query

    Products.findOne({
        where: {
            id: req.params.id
        }
    }).then(product => {
        return product.updateAttributes(updatedAttr)
    }).then(update => {
        res.json(update);
    });
})

//DELETE /products/:id
app.delete('/products/:id', (req, res) => {

    const id = req.params.id;
    Products.destroy({
        where: {
            id: id
        }
    }).then(deleted => res.json(deleted))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))