const express = require('express');
const massive = require('massive');
const http = require('http');
const app = express();
const router = express.Router();

router.get('/', (req, res) => {
	req.app.get('db').users.find({}, 
	{
	  fields: ["email", "details"],
      order: [{field: 'created_at', direction: 'desc'}]
    }).then(items => {
      res.json(items);
    });
});

router.get('/:id', (req, res) => {
	req.app.get('db').users.findOne(
	{ id: req.params.id }, 
	{
	  fields: ["email", "details"],
      order: [{field: 'created_at', direction: 'desc'}]
    }).then(items => {
      res.json(items);
    });
});

module.exports = router
