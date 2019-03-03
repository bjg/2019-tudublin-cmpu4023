const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const Sequelize = require('sequelize');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

var models = require('./models/index.js');

const ProductsController = require('./controllers/productsController.js');

function raw_insert(queryString) {
  sequelize.query(queryString).spread((results, metadata) => {
    console.log("insert complete");
  })
}


const sequelize = new Sequelize('pgguide', 'Emmet', 'petrolbear', {
    host: 'localhost',
    dialect: 'postgres',
    define: {
        timestamps: false
    }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

sequelize.sync({force: false}).then(() => {
  console.log('Successfully synced to DB');

  app.get('/products', (req, res) => {
        ProductsController.findAll(req, res);
    });

  app.get('/products/:id', (req, res) => {
        ProductsController.findOne(req, res);
    });

  app.post('/products', (req, res) => {
        ProductsController.create(req, res);
    });

  app.put('/products/:id', (req, res) => {
        ProductsController.update(req, res);
    });

  app.delete('/products/:id', (req, res) => {
        ProductsController.delete(req, res);
    });

  http.createServer(app).listen(3000);
});