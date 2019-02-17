//  Max MacDonald
//  C15740661

const express = require('express')
const app = express()
const port = 3000

const massive = require('massive');

massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'Max',
  password: 'Audioslave1!',
  ssl: false,
  poolSize: 10
}).then(instance => {
	app.set("db", instance);
});

app.get('/', (req, res) => res.send('Lab 1'))

// Return all users
app.get('/users', (req, res) => {
    req.app.get('db').users.find({},{
		fields: ['email'],
		exprs: {details: "details::json->>'sex'"},
		order: [{field: "created_at", direction: "desc"}]
    }).then(items => {res.json(items);
    });
});
 
// Return a specific user by id
app.get('/users/:id', (req, res) => {
    req.app.get('db').users.find({id: req.params.id},{
		fields: ["email"],
		exprs: {details: "details::json->>'sex'"}
    }).then(items => {res.json(items);
    });
});

// Return all products
app.get('/products', (req, res) => {
    req.app.get('db').products.find({},{
		order: [{field: "price", direction: "asc"}]
    }).then(items => {res.json(items);
    });
});
 
// Return all or a specific product by title (parameterised query)
app.get('/products_pq', (req, res) => {
	let query;
    if(req.query.name) {
        query = req.app.get('db').products.find({title: req.query.name},{
		order: [{field: "price", direction: "asc"}]
    })
    } else {
        query = req.app.get('db').products.find({},{
		order: [{field: "price", direction: "asc"}]
    })
    }
    return query.then(items => res.json(items))
});

// Return a specific product by title (stored procedure)
app.get('/products_sp', (req, res) => {
	let query;
    if(req.query.name) {
        query = req.app.get('db').prod_title(req.query.name, function(err, products){})
    } else {
        query = req.app.get('db').prod(function(err, products){})
    }
    return query.then(items => res.json(items))
});

// Return all or a specific product by title
// Done badly to allow for SQL Injection
app.get('/products_bad', (req, res) => {
	let query;
    if(req.query.name) {
        query = req.app.get('db').query(
		"select * from products where title = "+req.query.name)
    } else {
        query = req.app.get('db').query(
		"select * from products")
    }
    return query.then(items => res.json(items))
});

// Return a specific product by id
app.get('/products/:id', (req, res) => {
    req.app.get('db').products.find({id: req.params.id},{
    }).then(items => {res.json(items);
    });
});

// Return all purchases plus related data in raw SQL query
app.get('/purchases', (req, res) => {
    req.app.get('db').query(
	"select p.name, p.address, p.state, p.zipcode, u.email, pi.price, pi.quantity, " +
	"pi.state from purchases p inner join users u on p.user_id = u.id " +
	"inner join purchase_items pi on p.id = pi.purchase_id",
	{order: [{field: "price", direction: "desc"}]}
	).then(items => {res.json(items);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))