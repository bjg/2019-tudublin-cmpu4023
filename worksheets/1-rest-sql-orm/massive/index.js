const express = require('express')
const massive = require('massive');
const app = express()
const port = 3000


//listening on port
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//Post gres database
massive({
	host: '127.0.0.1',
	port: 5432,
	database: 'pgguide',
	user: 'ashleyfitzgerald',
	password: 'ashleymark'
}).then(db =>{
	app.set('db', db);
})


/***********************
       Lab Part 1
 ***********************/

//List users email and sex in order of when they were most recently created in descending order
// http://localhost:3000/users
app.get('/users', (req, res) => {
	app.get('db').users.find({}, {

		order:[{
			field:'created_at',
			direction: 'desc'
		}],
		//email and sex
		exprs: {
			email: 'email',
			gender: "details::json->>'sex'",
		}
	}).then(user => {
		res.send(user);
	})
})

//getting user by id
// http://localhost:3000/users/(id)
app.get('/users/:id', (req, res) => {
	console.log(req.params.id);
	app.get('db').users.find({
		id: req.params.id
	}, {
		order:[{
			field:'created_at',
			field: 'id',
		}],
		//email and sex
		exprs: {
			email: 'email',
			gender: "details::json->>'sex'",
		}
	}).then(user => {
		res.send(user);
	})
})

//show products in ascending order of price
// http://localhost:3000/products
app.get('/products', (req,res) => {
	app.get('db').products.find({}, {
		//ordering the products price in ascending order of price
		order:[{
			field: 'price'
		}],
		exprs: {
			products : 'products',
		}
	}).then(products=> {
		res.send(products);
	})
})

//get product description from id
// http://localhost:3000/products/11
app.get('/products/:id', (req,res) => {
	app.get('db').products.find({
		id: req.params.id
		},{
		order:[{
			field: 'price'
		}],
		exprs: {
			products : 'products',
		}
	}).then(products=> {
		res.send(products);
	})
})


//purchase items
// http://localhost:3000/purchases
  app.get('/purchases', (req, res) => { 
	app.get('db').query('SELECT purchases.name as Reciever_Name,purchases.address as Reciever_address, users.email as Purchaser_email,purchases.user_id, purchase_items.price as item_price, purchase_items.quantity as item_quantity, purchase_items.state as item_status FROM purchases JOIN purchase_items ON purchases.id = purchase_items.purchase_id JOIN users ON purchases.user_id = users.id').then(purchases=> {
		res.send(purchases);
	});
});


/***********************
       Lab Part 2
 ***********************/


//get products by title and show how bad sql injection can be carried out
//one can alter the data example: update a value as seen below, ive shown how one can alter the price of a product
//http://localhost:3000/products/Dictionary';UPDATE products SET price='10.99' WHERE title='Dictionary';--
app.get('/products/:title', (req,res) => {
	var query = req.params.title;
	app.get('db').query("SELECT * FROM products WHERE title= '"+query+"'").then(products=> {
		res.send(products);
	});
});

/***********************
       Lab Part 3
 ***********************/
//Protect against sql injection
//http://localhost:3000/productss/Dictionary'';UPDATE products SET price='10.99' WHERE title='Dictionary';--
//did not update product
app.get('/productss/:title', (req,res) => {
		var query = req.params.title;
		app.get('db').query(" SELECT * FROM products where title=($1)",[query] ).then(products=> {
		res.send(products);

	});
});


