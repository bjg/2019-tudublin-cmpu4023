const express = require('express');
const http = require('http');
const massive = require('massive');

const app = express();

const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://steve:enter6134@localhost:5432/pgguide',
{
  define:{
  timestamps:false
}});

const Products = sequelize.define('products',
{
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.NUMERIC
  },
  created_at: {
    type: Sequelize.TIME
  },
  deleted_at: {
    type: Sequelize.TIME
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  }
});

const PurchaseItems = sequelize.define('purchase_items', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  purchase_id: {
    type: Sequelize.INTEGER
  },
  product_id: {
    type: Sequelize.INTEGER
  },
  price: {
    type: Sequelize.NUMERIC
  },
  quantity: {
    type: Sequelize.INTEGER
  },
  state: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  }
});

const Purchases = sequelize.define('purchases', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  created_at: {
    type: Sequelize.TIME
  },
  name: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  },
  address: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  },
  state: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  },
  zipcode: {
    type: Sequelize.INTEGER
  },
  user_id: {
    type: Sequelize.INTEGER
  }
})

const Users = sequelize.define('users',
{
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  email: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  },
  password: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  },
  details: {
    type: Sequelize.HSTORE
  },
  created_at: {
    type: Sequelize.TIME
  },
  deleted_at: {
    type: Sequelize.TIME
  } 
});

  app.get('/', (req, res) => {
      res.send("YEET");
      sequelize.authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  });

  app.get('/products/:id', (req, res) => {
    console.log(req.params.id);
    Products.findAll({
      where: {
        id: req.params.id
      }
    }).then(product => {
      return res.json(product);
    })
  });

  app.get ('/products/', (req, res) => {
    Products.findAll().then(product => {
      return res.json(product);
    });
  });

  app.post('/products', (req,res) => {
    Products.sync().then(() => {
      return Products.create({
        id: 25,
        title: 'PS4',
        price: '13.50',
        tags: ['Games']
      });
    });
    return res.send("Item created at id 25");
  });

  app.put('/products/:id', (req,res) => {
    Products.update(
      {title: "Updated!"},
      {where: {
        id: req.params.id
      }}
    )
    return res.send("row " + req.params.id + " updated");
   });

  app.delete('/products/:id', (req, res) => {
    Products.destroy({
      where: {
        id: req.params.id,
      }
    });
    return res.send("item " + req.params.id + " deleted");
  });

  
  http.createServer(app).listen(3000);
