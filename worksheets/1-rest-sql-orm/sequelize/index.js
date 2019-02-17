/** PROBLEM SET 4 */

'use strict'
const express = require('express');
const Sequelize = require('sequelize');
const models = require('./models/index');
const bodyParser = require('body-parser');
const router = require('./routes/crud');

const app = express();
const port = 3000;

const sequel = new Sequelize({
  username: 'postgres',
  database: 'pgguide', 
  password: 'bramble',
  host: 'localhost',
  dialect: 'postgres',
  define: {
      timestamps: false
  }
});
app.set('db', sequel);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

router(app, models);


sequel.authenticate()
      .then(() => {
        console.log('Connected to the DB.')

        app.listen(port, () => console.log(`Example app listening on port ${port}!`));

      })
      .catch(err => {
          console.error('Connection failed', err);
      });

