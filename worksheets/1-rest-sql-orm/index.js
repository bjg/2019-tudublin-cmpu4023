const express = require('express');
const app = express();
const port = 3000;
const massive = require('massive');


massive({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'password123',
  ssl: false,
  poolSize: 10
}).then(instance => {
	app.set('db',instance);
});

//localhost:3000/users 
app.get('/users', (request, response) => 
{
    request.app.get('db').query('select email, details from users order by created_at desc').then(get_info => 
	{
      response.json(get_info);

    });
});

//localhost:3000/users/1
app.get('/users/:id', (request, response) => 
{
    request.app.get('db').query('select * from users where id = ' + request.params.id).then(get_info => 
	{
      response.json(get_info);
    });
});
//localhost:3000/products/
app.get('/products', (request, response) => 
{
	request.app.get('db').query('select * from products order by price ASC').then(get_info => 
	{
	  response.json(get_info);
	});
});

//get the products ID	  
app.get('/products/id/:id', (request, response) => 
{
	request.app.get('db').query('select * from products where id = ' + request.params.id).then(get_info => 
	{
		response.json(get_info);
	});
});

//Get all purchases

/*List purchase items to include the receiver’s name and, address, 
the purchaser’s email address and the price, quantity and delivery 
status of the purchased item. Order by price in descending order
*/


app.get('/purchases', (request, response) => 
{
	request.app.get('db').query(
	'select purchase_items.quantity, purchase_items.state, \
        users.email,purchases.name, purchases.address, products.price from purchase_items \
		JOIN purchases ON purchase_items.purchase_id = purchases.id \
        JOIN products ON purchase_items.product_id = products.id \
		JOIN users ON purchases.user_id = users.id \
        order by purchase_items.price DESC')
	.then(get_info => 
	{
	  response.json(get_info);
	});
});

//badly written getten title -- SQL can be injected
//	';create table chloe(id integer);-- 
//localhost:3000/products/badly-written?name=Dictionary';drop table test1;--
//this creates a table -- bad

app.get('/products/badly-written', function(request, response) 
{
    request.app.get('db').query('SELECT * FROM products WHERE title LIKE \'%' + request.query.name + '\'')
    .then(result => response.send(result))
})


//localhost:3000/product?name=Dictionary';create table chloe(id integer);--
//this does not create a table --good
//Paramaterised query
 app.get('/products/param', (request, response) => 
{
	let title = request.query.name;
	request.app.get('db').query("select * from products where title=$1", [title]).then(get_info => 
	{
	  response.send(get_info);
	});
});


//stored procedure 
//localhost:3000/products/proc?title=Dictionary';drop table chloe;--
//does not drop table


app.get('/products/proc/', (request, response) => 
{
        const name = request.query.name;
        request.app.get('db').get_prods(name)
		.then(get_info =>
			response.send(get_info))
		.catch(error =>
			console.log("error:"+ error))
		
    });



app.listen(port, () => console.log(`Example app listening on port ${port}!`));

