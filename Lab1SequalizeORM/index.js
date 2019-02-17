const express = require('express')
const Sequelize = require('sequelize');
const app = express()
const port = 3000
var bodyParser = require('body-parser');


const sequelize = new Sequelize('postgres', 'postgres', 'test1234', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  define: {
    timestamps: false
    },

  operatorsAliases: false
});

app.get('/', (req, res) => {
  sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
});

const User = sequelize.define('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    details: {
        type: Sequelize.HSTORE
    },
    created_at: {
        type: Sequelize.DATE
    },
    deleted_at: {
        type: Sequelize.DATE
    }
  });

  const Products = sequelize.define('products', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING
    },
    price: {
        type: Sequelize.FLOAT
    },
    created_at: {
        type: Sequelize.DATE
    },
    deleted_at: {
        type: Sequelize.DATE
    },
    tags : {
        type: Sequelize.ARRAY(Sequelize.TEXT)
    }
  });

  const Purchases = sequelize.define('purchases', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    created_at: {
        type: Sequelize.DATE
    },
    zipcode: {
        type: Sequelize.INTEGER
    },
    state: {
      type: Sequelize.STRING
    },
    user_id : {
        type: Sequelize.INTEGER
    }
  });

//  User.create({
//    id: 76,
//    email: 'Testgary@gmail.com',
//    password: 'test1234',
//    details: 'M'
//  }).then(user => {
//        console.log(user.get({
//          plain: true
//        }))
//      })

    //  Purchases.create({
    //   id: 89,
    //   name: 'Test',
    //   address: 'test house',
    //   state: 'DB',
    //   zipcode: 14,
    //   user_id: 1331
    // }).then(user => {
    //       console.log(user.get({
    //         plain: true
    //       }))
    //     })


//Just Products
/*

curl command to run it from bash

curl -X GET \
  http://localhost:3000/products/ \
  -H 'Postman-Token: 968af05c-fb53-4f61-809f-aae83184fd78' \
  -H 'cache-control: no-cache'
*/
app.get ('/products/', (req, res) => {
  Products.findAll().then(product => {
    return res.json(product);
  });
  });

/*

curl -X GET \
  http://localhost:3000/products/12 \
  -H 'Postman-Token: c6c4b9e1-8db6-4a56-9798-c22f110a1ce7' \
  -H 'cache-control: no-cache'

*/

// Product with ID
app.get('/products/:id', (req, res) => {
console.log(req.params.id);
Products.findAll({
  where: { id: req.params.id }
}).then(product => {
  return res.json(product);
})
});

/*

curl command to create new product from command

curl -X POST \
  http://localhost:3000/products/ \
  -H 'Postman-Token: fab5e98b-62c4-4063-b092-38c2b97388a0' \
  -H 'cache-control: no-cache'

*/
 
// Creating new product instance
app.post('/products', (req,res) => {
Products.sync().then(() => {
  return Products.create({
    id: 57,
    title: 'LG TV',
    price: '600.00',
    tags: ['Home Entertainment']
  });
});
return res.send("Item created at id 55");
});

/*

curl -X PUT \
  http://localhost:3000/products/57 \
  -H 'Postman-Token: 5ee8984d-cba4-4835-a978-b9920a1d8e89' \
  -H 'cache-control: no-cache'

*/

//Updating an existing product
app.put('/products/:id', (req,res) => {
Products.update({
  title: "UPDATED TITLE? PLZ!"},
  {
  where: {
    id: req.params.id
  }}
)
return res.send("Updated Row : " + req.params.id);
});

/*

curl -X DELETE \
  http://localhost:3000/products/57 \
  -H 'Postman-Token: bb9bc071-6502-42bc-af60-4a18f50805f4' \
  -H 'cache-control: no-cache'

*/

//Removing an existing product
app.delete('/products/:id', (req, res) => {
Products.destroy({
  where: {
    id: req.params.id,
  }
});
return res.send("Deleted Row with id: " + req.params.id);
});

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
})

