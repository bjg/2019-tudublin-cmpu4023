const express = require('express');
const massive = require('massive');
const http = require('http');
const app = express();
const router = express.Router();

const sql = "select purchases.name, purchases.address, users.email, purchase_items.quantity, purchase_items.price, purchase_items.state from purchases join users on purchases.user_id = users.id join purchase_items  on purchases.id = purchase_items.purchase_id order by purchase_items.price desc;"

router.get('/', (req, res) => {
	req.app.get('db').query(sql)
	.then(items => {
      res.json(items);
    });
});

router.get('/:name', (req, res) => {
	req.app.get('db').query("select purchases.name, purchases.address, users.email, purchase_items.quantity, purchase_items.price, purchase_items.state from purchases join users on purchases.user_id = users.id join purchase_items  on purchases.id = purchase_items.purchase_id where purchases.name = "+"'"+req.params.name+"';")
	.then(items => {
      res.json(items);
    });
});

router.get('/proc/:name', (req, res) => {
	req.app.get('db').product_name(req.params.name)
	.then(items => {
      res.json(items);
    });
});

router.get('/injection/:name', (req, res) => {
	req.app.get('db').query("select purchases.name, purchases.address, users.email, purchase_items.quantity, purchase_items.price, purchase_items.state from purchases join users on purchases.user_id = users.id join purchase_items  on purchases.id = purchase_items.purchase_id where purchases.name ="+req.params.name)
	.then(items => {
      res.json(items);
    });
});

module.exports = router
