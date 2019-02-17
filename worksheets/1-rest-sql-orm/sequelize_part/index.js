const express = require('express')
const app = express()
const port = 3000
const Sequelize = require('sequelize');
const Model = require("./node_modules/.bin/models/index")

const sequelize = new Sequelize('pgguide', 'postgres', 'postgres',{
	host: "localhost",
	dialect: "postgres"})
	
//6.0
app.get('/products', (req, res) => {	
		Model.products.findAll({where:{title:{[Sequelize.Op.like]:"%"+req.query.name+"%"}}})
		.then(results => {
			res.json(results);})})
	
//6.1
app.get('/products/:id', (req, res) => {
		Model.products.findOne({where:{id:req.params.id}})
		.then(results => {
			res.json(results);})})

//6.2
app.post('/products', (req, res) => {
	Model.products.create({title:req.body.title, price:req.body.price, tags: req.body.tags})
	.then(results => {
		res.json(results);})})
	
//6.3
app.put('/products/:id', (req, res) => {
	Model.products.update({title: req.body.title, price: req.body.price, tags: req.body.tags},
	{where:{id:req.params.id}})
	.then(results => {
		res.json(results);})})
		
//6.4
app.delete('/products/:id', (req, res) => {
	Model.products.destroy({where:{id:req.params.id}})
	.then((results) =>{
		res.json(results)})})
		
//---http end points converted from the massive section---//
//1.0
app.get('/users', (req, res) => {	
		Model.users.findAll({attributes: ['email', 'details'], order: [['created_at', 'DESC']]})
		.then(results => {
			res.json(results);})})
			
//1.1
app.get('/users/:id', (req, res) => {
		Model.users.findOne({where:{id:req.params.id}, attributes: ['email', 'details'], order: [['created_at', 'DESC']]})
		.then(results => {
			res.json(results);})})

//1.2			
app.get('/products', (req, res) => {	
		Model.products.findAll({order: [['price', 'ASC']]})
		.then(results => {
			res.json(results);})})
			
//1.3			
app.get('/products/:id', (req, res) => {	
		Model.products.findOne({where:{id:req.params.id}, order: [['price', 'ASC']]})
		.then(results => {
			res.json(results);})})	
			
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


