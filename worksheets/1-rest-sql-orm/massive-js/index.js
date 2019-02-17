const express = require('express');
const massive = require('massive');
const app = express();
const port = 3000;

massive({
  host: 'localhost',
  port: 5432,
  database: 'enterprise',
  user: 'Eoghan Quirke',
  password: 'eoghan',
  ssl: false,
  poolSize: 10
}).then(instance => {app.set("db", instance)
	//Insert dummy record to be deleted
	instance.products.insert({
		id:21,
		title: 'please delete me',
		price: 300
	}).then(test => {
		console.log("Dummy record insert");
	})
	.catch(err => {console.log("Record already exists")});
});


app.get('/', (req, res) => res.send('Hello World!'));

app.get('/users', (req, res) => {

	app.get("db").users.find({},
		{fields:["email"],
		exprs:{sex:"details::json->>'sex'"}, 
		order: [{
		field: "created_at",
		direction: "asc"
	}]})
	.then(result => {res.json(result);})
	.catch(err => {res.send("\"error\":\"User not Found\"")})
});

app.get('/users/:id', (req, res) => {
	//app.get("db").query("select email, details::json->>'sex' as sex from users where id = $1 order by created_at asc", [parseInt(req.params.id)])
	app.get("db").users.find({id:parseInt(req.params.id)},
		{fields:["email"],
		exprs:{sex:"details::json->>'sex'"}, 
		order: [{
		field: "created_at",
		direction: "asc"
	}]})
	.then(result => {res.json(result);})
	.catch(err => {res.send("\"error\":\"User not Found\"")})});
	
/*
INJECTION: Book';delete from products where id = 300;--
*/
app.get('/dodgy-products', (req, res) => {
		
	if(req.query.name != null){
		
		console.log(unescape(req.query.name));
		//VUNERABLE VERSION
		app.get("db").query("select id, title, created_at, deleted_at, tags from products where title like \'%" + req.query.name + "%\' order by price asc")
		.then(result => {res.json(result);})
		.catch(err => {res.send("\"error\":\"Products not Found\"");console.log(err);})		
	}
	else{
		
		app.get("db").products.find({}, {
			order:[{field: "price",
			direction: "asc"}]
		})
		.then(result => {res.json(result);})
		.catch(err => {res.send("\"error\":\"Products not Found\"")})
		
	}
});
	
app.get('/function-products', (req, res) => {
		
	if(req.query.name != null){
		//SAFE ALTERNATIVE USING STORED PROCEDURE
		app.get("db").get_products_by_title(req.query.name)
		.then(result => {res.json(result);})
		.catch(err => {res.send("\"error\":\"No Purchase with this name\"")})
		
	}
	else{
		
		app.get("db").products.find({}, {
			order:[{field: "price",
			direction: "asc"}]
		})
		.then(result => {res.json(result);})
		.catch(err => {res.send("\"error\":\"Products not Found\"")})
		
	}
});

app.get('/products', (req, res) => {
		
	if(req.query.name != null){
				
	//SAFE ALTERNATIVE USING PARAMETERISED QUERY
		app.get("db").products.find({or:[{'title like':"%"+req.query.name+"%"}]}, {
		order:[{field: "price",
		direction: "asc"}]
	})
	.then(result => {res.json(result);})
	.catch(err => {res.send("\"error\":\"Products not Found\"")})
	}
	else{
		
		app.get("db").products.find({}, {
			order:[{field: "price",
			direction: "asc"}]
		})
		.then(result => {res.json(result);})
		.catch(err => {res.send("\"error\":\"Products not Found\"")})
		
	}
});

app.get('/products/:id', (req, res) => {
	app.get("db").products.find({id:parseInt(req.params.id)}, {
			order:[{field: "price",
			direction: "asc"}]
	})
	.then(result => {res.json(result);})
	.catch(err => {res.send("\"error\":\"Product not Found\"")})
});


app.get('/purchases', (req, res) => {
		
	app.get("db").query("select p.id, p.created_at, p.name, p.address, u.email, pi.price, pi.quantity, pi.state from purchases p inner join purchase_items pi on pi.purchase_id = p.id inner join users u on u.id = p.user_id")
	.then(result => {res.json(result);})
	.catch(err => {res.send("\"error\":\"Purchases not Found\"")});
});

app.listen(port, () => console.log('Example app listening on port 3000!'));