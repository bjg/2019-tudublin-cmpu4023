const express = require("express");
const bodyParser = require('body-parser');
//FOR DATA POPULATION
//const faker = require("faker");
//const times = require("lodash.times");
//const random = require("lodash.random");
//FOR DATA POPULATION
const db = require("./models");
const apiProducts = require("./app/api/products-api-pt6");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("app/public"));

apiProducts(app, db)

console.log(apiProducts(app, db));



db.sequelize.sync().then(() => {
    /*

    db.products.bulkCreate(
    times(10, () => ({
      title: faker.lorem.sentence(),
      price: random(1, 10),
      tags: faker.lorem.sentence()
    }))
  );

  db.users.bulkCreate(
    times(250, () => ({
        details: faker.lorem.sentence()
    }))
  );

  db.purchases.bulkCreate(
    times(100, () => ({
        name: faker.lorem.sentence(),
        address: faker.lorem.sentence(),
        zipcode: random(1, 20)
    }))
  );

  db.purchase_items.bulkCreate(
    times(100, () => ({
        price: random(1, 10),
        quantity:random(1, 20),
        state: faker.lorem.sentence()
    }))
  );
*/

    app.listen(8080, () => console.log("App listening on port 8080!"));
});