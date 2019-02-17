const express = require('express');
const http = require('http');
const Sequelize = require('sequelize');

const UserModel = require('./models/user');
const ProductModel = require('./models/products');
const PurchaseModel = require('./models/purchases')
const PurchaseItemsModel = require('./models/purchase_items')

const app = express();
const sequelize = new Sequelize('postgres:localhost:5432/db_dev');

const Product = ProductModel(sequelize, Sequelize);

var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

sequelize.authenticate()
.then(() => {

    app.get('/products', (req, res) => {
        Product.findAll().then(users => res.json(users));
    });

    app.get('/products/:id', (req, res) => {
        Product.findAll({where:{id: req.params.id}}).then(users => res.json(users));
    });

    app.post('/products', (req, res) => {
        Product.create({
            title: req.body.title,
            price: req.body.price,
            created_at: req.body.created_at,
            deleted_at: req.body.deleted_at,
            tags: req.body.tags,
            createdAt: req.body.createdAt,
            updatedAt: req.body.updatedAt
        }).then(product => {
            res.json(product);
        })
    });

    app.put('/products/:id', (req, res) => {
        const newData = {
            tags: req.body.tags
        }

        console.log(newData);

        Product.update(
            newData, 
            {where: {id: req.params.id}}
        ).then(product => {
            res.json(product)
        });

    });

    app.delete('/products/:id', (req, res) => {
        Product.destroy({
            where: {id: req.params.id}
        }).then(deleted => {
            res.json(deleted);
        });
    });

})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

http.createServer(app).listen(3000);
