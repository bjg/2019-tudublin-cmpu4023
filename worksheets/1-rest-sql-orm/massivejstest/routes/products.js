const express = require('express');
const massive = require('massive');
const http = require('http');
const app = express();
const router = express.Router();

router.get('/', (req, res) => {
	req.app.get('db').products.find({}, {
	  order: [{field: 'price', direction: 'asc'}]
    }).then(items => {
      res.json(items);
    });
});

router.get('/:id', (req, res) => {
	req.app.get('db').products.findOne(
	{ id: req.params.id }, 
	{
	  order: [{field: 'price', direction: 'asc'}]
    }).then(items => {
      res.json(items);
    });
});

module.exports = router

  
