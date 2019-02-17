const express = require('express')
const app = express()
const port = 3000
const massive = require('massive')

massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'postgres',
  ssl: false,
  poolSize: 10
}).then(instance => {app.set("db", instance);});

//1.0
app.get('/users', (req, res) => {req.app.get("db").query('select email, details from users order by created_at desc;').then(items => {
res.json(items);});});

//1.1
app.get('/users/:id', (req, res) => {
	var id = req.params.id;
	req.app.get("db").query('select email, details from users where id = ${id} order by created_at desc;',
		{id : req.params.id}).then(items => {
res.json(items);});});

//1.2
app.get('/products', (req, res) => {req.app.get("db").query('select * from products order by price asc;').then(items => {
res.json(items);});});


//1.3
app.get('/products/:id', (req, res) => {
	var id = req.params.id;
	req.app.get("db").query('select * from products where id = ${id} order by price asc;',
		{id : req.params.id}).then(items => {
res.json(items);});});

//1.4
app.get('/purchases', (req, res) => {req.app.get("db").query('select name, address, email, price, quantity, p.state from purchases join users on user_id=users.id join purchase_items p on purchases.id = purchase_id order by price desc;').then(items => {
res.json(items);});});

//2
app.get('/products', (req, res) => {
	var name = getRequestString("name");
	var sql = "select * from products where title = " + name +";";
	req.app.get("db").query(sql,
		{name : req.query.name}).then(items => {
res.json(items);});});//will allow for sql injections

//3
app.get('/products', (req, res) => {
	req.app.get("db").query("CALL NoInject(${name});",
		{name : req.query.name}).then(items => {
res.json(items);});});//one of the two solutions (using created procedure see q3_solution2_storedprocedure.png) for preventing sql injects

//3
app.get('/products', (req, res) => {
	req.app.get("db").query("select * from products where title = ${name}",
		{name : req.query.name}).then(items => {
res.json(items);});});

  
app.listen(port, () => console.log(`Example app listening on port ${port}!`))