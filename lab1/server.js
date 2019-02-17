const express = require("express");
//https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
const bodyParser = require('body-parser');
const times = require("lodash.times");
const db = require("./models");
const apiProducts = require("./app/api/products");
const app = express();
app.use(bodyParser.json());
app.use(express.static("app/public"));

apiProducts(app, db)

db.sequelize.sync().then(() => {
  //https://github.com/sequelize/sequelize/issues/3555
  db.users.bulkCreate(
    times(1, () => ({
	id: 2008,
        email: 'random@mail.com',
	password: "password"
    }))
  );

  db.products.bulkCreate(
    times(1, () => ({
	title: "Fake title",
	price: 1000,
	id: 2402
    }))
  );

  db.purchases.bulkCreate(
    times(1, () => ({
      name: "Fake name",
      address: "Fake address",
      zipcode: 111,
      id: 1223
    }))
  
  );

  app.listen(8080, () => console.log("App listening on port 8080!"));
});
