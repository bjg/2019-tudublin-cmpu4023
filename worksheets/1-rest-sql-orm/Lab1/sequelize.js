const Sequelize = require('sequelize');
const express = require('express');
const app = express();
const port = 3000;
// Or you can simply use a connection uri
const bodyParser = require('body-parser');
const sequelize = new Sequelize('postgres://Dano:123@localhost:5432/pgguide');
const db = require('./models');

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.get('/', (req, res) => {
    res.json('Hello World!');
});

//Get Products (all) or with a query
app.get('/products', (req, res) => {
    if(req.query.name) {
        db.products.findAll({
                where: {title: req.query.name}
        }).then(resp => {
            res.json(resp);
        })
    }
    else{
        db.products.findAll().then(resp =>
        {
            res.json(resp);
        })
    }
});

app.get('/products', (req, res) => {
    if(req.query.name) {
        db.products.findAll({
            where: {title: req.query.name}
        }).then(resp => {
            res.json(resp);
        })
    }
    else{
        db.products.findAll().then(resp =>
        {
            res.json(resp);
        })
    }
});

//Get a product by ID parameter
app.get('/products/:id', (req, res) => {
    db.products.findAll({
        where: {id: req.params.id}
    }).then(resp => {
        res.json(resp);
    })
});

//Add new entry to product column
app.post('/product', (req, res) => {
    db.products.create({title:"Test",}).then(resp => {
        res.json(resp);
    })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));