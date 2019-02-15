const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const massive = require('massive');

massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'Kevisarat',
  ssl: false,
  poolSize: 10
}).then(instance => {
	app.set('db',instance);
    
    // ------- Part 1 --------------------------------------------
    // List all users email and sex in order of most recently created. Do not include password hash in your output
    app.get('/users', (req,res) => {
    instance.query('select email, details from users order by (created_at) desc').then(users => res.send(users))
    });
    
    // Show email and sex of specified user
    app.get('/users/:id', (req,res) => {
        var user_id  = req.params.id;

        instance.query(`select * from users where id = ${user_id}`).then(users => res.send(users))
    });

    // List all products in ascending order of price
    app.get('/products', (req,res) => {
        if(req.query.name == null)
        {
            instance.query('select * from products order by (price) asc').then(users => res.send(users)) 
        }      
        // ------- Part 2 --------------------------------------------
        // Extend the product indexing endpoint to allow the filtering of products by name

        // Query to add temporary value to delete
        // Baby Book'; insert into products (id, title, price) values (210, 'Baby Book', '15.95'); --
        
        // Query to remove temporary value
        // Baby Book'; delete from products where id = 210; --
        
        /*
        else
        {
            instance.query(`select * from products where title = '${req.query.name}' order by (price) asc`).then(users => res.send(users))
        }
        */

        
        // ------- Part 3 --------------------------------------------
        // Provide two solutions to eliminate the security hole in your approach from the previous section
        
        // Parameterised query
        else
        {
            instance.query('select * from products where title = $1 order by (price) asc', [`${req.query.name}`]).then(users => res.send(users))
        }
    });

    // Show details of the specified products
    app.get('/products/:id', (req,res) => {
        var prodID = req.params.id;

        instance.query(`select * from products where id = ${prodID}`).then(users => res.send(users))
    });

    // List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, 
    // quantity and delivery status of the purchased item. Order by price in descending order
    app.get('/purchases', (req,res) => {
        instance.query('select purchases.name, purchases.address, users.email, purchase_items.price, '
        + ' purchase_items.quantity, purchase_items.state from purchases '
        + ' join users on purchases.user_id = users.id '
        + ' join purchase_items on purchases.id = purchase_items.purchase_id order by (price) desc').then(users => res.send(users))
    });
});