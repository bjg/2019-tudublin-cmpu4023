// C14413458
// Matas Nedzveckas

const express = require('express')
const app = express()
const port = 3000;

// Body Parser is required as nodejs does not provide this functionaly by default
const bodyParser = require('body-parser');
var urlencodeds = bodyParser.urlencoded({extended: false});
const models = require('./server/models/index');


// Inserting data part for part 5

// models.userst.create({
// 	id: 51,
// 	email: 'jonhwick@kickass.com',
// 	password: 'password',
// 	details: '\"sex\"=>\"M\"'
// });

// models.productstable.create({
//     title: 'iPhone Xr',
//     price: '999.99',
//     tags: ['Technology']
// })

// models.purchase_itemst.create({
//     purchase_id: 1,
//     product_id: 2,
//     price: 5.99,
//     quantity: 1,
//     status: 'Delivered'
// })

// models.purchaset.create({
//     name: 'John Wick',
//     address: 'JH442 Belvedier road',
//     state: 'Washington',
//     zipcode: 'ZL123',
//     user_id: 3
// })


// Part 6 the Restful API with sequalize 

// GET /products[?name=string]
// Test - curl http://localhost:3000/products?name=iPhone%20Xr
// image included
app.get('/products', (req, res) => {
    //Show above details of the specified user
    models.productstable.find({
        where: {
            title: req.query.name
        }
    }).then(product => res.json(product));
})

// GET /products/:id
// test - curl http://localhost:3000/products/1
// image included
app.get('/products/:id', (req, res) => {
    //Show above details of the specified user
    models.productstable.find({
        where: {
            id: req.params.id
        }
    }).then(product => res.json(product));
})

// POST /products
// test matthewned$ curl --data "title=test&price=3.99&tags=techno" http://localhost:3000/products
// image included
app.post('/products', urlencodeds,(req, res) => {
    models.productstable.create({
        title: req.body.title,
        price: req.body.name
    }).then(product => res.json(product))
})

// PUT /products/:id
// test curl -X PUT --data "price=1299.99" http://localhost:3000/products/1
// picture included
app.put('/products/:id', urlencodeds, (req, res) => {
    models.productstable.find({
        where: {
            id: req.params.id
        }
    }).then((product => {
        product.updateAttributes({
            price: req.body.price,
        }).then(product => { res.json(product)
        })
    }))
})


// Delete  /products/:id
// test - curl -X DELETE http://localhost:3000/products/4
// included
app.delete('/products/:id', (req, res) => {
    models.productstable.destroy({
        where: {
            id: req.params.id
        }
    }).then(product => res.json(product))
})


app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' })
  })
app.listen(port, () => console.log('Example app listening on port ${port})!'))