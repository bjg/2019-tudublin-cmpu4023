const express = require('express');
const bodyParser = require('body-parser');

// dependencies
const { Users, Products} = require('./sequelize');

const app = express();
app.use(bodyParser.json());

const port = 3000;
app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
});

// get all users
app.get('/users', (req, res) => {
    Users.findAll().then(users => res.json(users))
});

app.get('/products', (req,res) => {
    Products.findAll().then(products => res.json(products))
});

app.get('/products/:id', (req, res) => {
    Products.findById(req.params.id).then(product => res.json(product))
});

app.post('/products', (req, res) => {
    /*
    curl -X POST \
      http://localhost:3000/products \
      -H 'Content-Type: application/json' \
      -H 'Postman-Token: a2655c94-9839-47e6-b380-d1fab5de82e2' \
      -H 'cache-control: no-cache' \
      -d '{
        "title": "Hello",
        "price": 520
        }'
     */

    Products.create(req.body).then(product => res.json(product))
});

app.put('/products/:id', (req, res) => {

    /*

    curl -X PUT \
      http://localhost:3000/products/[PRODUCT ID] \
      -H 'Content-Type: application/json' \
      -H 'Postman-Token: d19ffc20-efcb-47c4-ab86-3474c113ae36' \
      -H 'cache-control: no-cache' \
      -d '{
        "title": "Update",
        "price": 520
    }'

     */

    Products.findOne({
        where: {id : req.params.id}
    })
        .then((record) => {
            return record.update(req.body);
        })
        .then((record) => res.json(record));
});


app.delete('/products/:id', (req, res) => {
    Products.destroy({
        where: {
            id: req.params.id
        }
    })
});
