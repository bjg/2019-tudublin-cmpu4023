const express = require('express');
const app = express();
const port = 3000;
const Sequelize = require('sequelize');
const model = require("./models/index");

const sequelize = new Sequelize('pgguide', 'daniel', 'brunomoloney',{
	host: "127.0.0.1",
	dialect: "postgres"})

//6 get /products where name is like title
app.get('/products', function(req, res) {	
	model.products.findAll({where: {title:{[Sequelize.Op.like]:"%" +req.query.name +"%"}}})
	.then(data => {
		res.json(data);
	});
});

 //6 get /products/:id 
app.get('/products/:id', function(req, res) {
	model.products.findOne({ where:{ id:req.params.id}})
	.then(data => {
		res.json(data);
	});
});

//6 post /products new instance
app.post('/products', function(req, res) {
	const title = req.query.title;
	const price = req.query.price;
	const tags = req.query.tags;
	model.products.create({ title:title, price:price, tags:tags})
	.then(function(data) {
		res.json(data);
	});
});

 //6 put /products/:id update existing products instance
app.put('/products/:id', function(req, res) {
	const title = req.query.title;
	const price = req.query.price;
	model.products.find({where:{id: req.params.id}})
	.then(function(data) {
		if(data){
			data.updateAttributes({
				title: title, price: price
			}).then(function(data) {
				res.send(data);
			});
		}
	});
});

 //6 delete /products/:id delete existing product instance
app.delete('/products/:id', function(req, res) {
	model.products.destroy({where:{id:req.params.id}})
	.then((data) =>{
		res.json(data);
	});
});

 app.listen(port, () => console.log(`Example app listening on port ${port}!`))