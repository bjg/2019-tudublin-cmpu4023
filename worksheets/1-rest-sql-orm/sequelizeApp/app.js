const express = require('express')
const app = express()
const port = 3000

const models = require('./server/models');

// Required for curl requests
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Lab 1: Sequeize App'))

/*
List all products. Test (url):
    http://localhost:3000/products?title=Toothbrush
    OR
    http://localhost:3000/products
*/
app.get('/products', (req, res) => {
    if (req.query.title == null) {
        models.SeqProducts.findAll().then(
            seqProds => res.send(seqProds)
        )
    }
    else {
        models.SeqProducts.findAll( {
            where: {
                title: req.query.title
            }
        }).then(seqProds => res.send(seqProds))
    }
})

/*
Show details of the specified products. Test (url):
    http://localhost:3000/products/2
*/
app.get('/products/:id', (req, res) => {
    models.SeqProducts.findAll( {
        where: {
            id: req.params.id
        }
    }).then(seqProds => res.send(seqProds))
})

/*  
Create a new product instance.
To test, open bash and execute:
    curl -i -X POST -H "Content-Type: application/json" -d '{ "title": "Sunglasses", "price": "89.99"
    , "tags": ["RayBan", "Summer", "Sunglasses"]}' localhost:3000/products
*/
app.post('/products', (req, res) => {
    models.SeqProducts.create( {
        title: req.body.title,
        price: req.body.price,
        created_at: new Date(),
        tags: req.body.tags
    })
})

/*
Remove an existing product. Test:
    curl -i -X DELETE localhost:3000/products/1
*/
app.delete('/products/:id', (req, res) => {
    models.SeqProducts.destroy( {
        where: {
            id: req.params.id
        }
    })
})

/*
Update an existing product. Test:
    curl -i -X PUT -H "Content-Type: application/json" -d '{ "title": "Java Book", "price": "34.99",
    "tags": ["Book", "Programming", "Java"]}' localhost:3000/products/1
*/
app.put('/products/:id', (req, res) => {
    models.SeqProducts.findOne( {
        where: {
            id: req.params.id
        }
    }).then(product => {
        if (product) {
            product.updateAttributes({
                title: req.body.title,
                price: req.body.price,
                tags: req.body.tags
            })
        }
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))