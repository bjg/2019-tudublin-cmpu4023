/*
Student Number: C15440858
Module: Enterprise Application Development
Lab: 1
*/

//Requirements.
const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
const port = 3000;

///Question 4.
//Connection setup
const sequelize = new Sequelize('postgres://postgres:admin@localhost:5432/pgguide');
const op = Sequelize.Op;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});


//(Models)
//Product Model
const Products = sequelize.define('products',
{
    id: 
	{
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    title: 		{ type: Sequelize.STRING },
    price: 		{ type: Sequelize.NUMERIC },
    tags: 		{ type: Sequelize.ARRAY(Sequelize.STRING)},
    created_at: { type: Sequelize.DATE },
    deleted_at: { type: Sequelize.DATE }
},
{
    timestamps: false
});

//Purchase Items Model
const Purchase_Items = sequelize.define('purchase_items',
{
    id: 
	{
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    purchase_id: 		{ type: Sequelize.NUMERIC },
    product_id: 		{ type: Sequelize.NUMERIC },
    price: 				{ type: Sequelize.NUMERIC },
	quantity:			{ type: Sequelize.NUMERIC },
	state: 				{ type: Sequelize.STRING }
},
{
    timestamps: false
});

//Purchases Model
const Purchases = sequelize.define('purchases',
{
    id: 
	{
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },

    created_at: 		{ type: Sequelize.DATE },
    name: 				{ type: Sequelize.STRING },
    address: 			{ type: Sequelize.STRING },
    state: 				{ type: Sequelize.STRING },
    zipcode: 			{ type: Sequelize.NUMERIC },
	user_id:			{ type: Sequelize.NUMERIC },
},
{
    timestamps: false
});

//User Model
const Users = sequelize.define('users', 
{
    id:
	{
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    email: 		{ type: Sequelize.STRING, field: 'email' },
    password: 	{ type: Sequelize.STRING, field: 'password' },
    details: 	{ type: Sequelize.HSTORE, field: 'details' },
    created_at: { type: Sequelize.DATE },
    deleted_at: { type: Sequelize.DATE }
}, 
{
    timestamps: false
});



///Question 5
//Add new product through model
app.put('/products', (req, res, next) => 
{
    const body = req.body;
    Products.create(
	{
        id: sequelize.literal('DEFAULT'),
        title: body.title,
        price: body.price,
        tags: body.tags,
        created_at: sequelize.literal('CURRENT_TIMESTAMP')
    })
	.then((result) => 
	{
        res.json(result);
        res.end();
    });
});

//Add new purchase items through model
app.put('/purchase_items', (req, res, next) =>
{
    const body = req.body;
    Purchase_Items.create(
	{
        id: sequelize.literal('DEFAULT'),
        purchase_id: body.purchase_id,
        product_id: body.product_id,
        price: body.price,
		quantity: body.quantity,
		state: body.state,
    })
	.then((result) => 
	{
        res.json(result);
        res.end();
    });
});

//Add new purchases through model
app.put('/purchases', (req, res, next) =>
{
    const body = req.body;
    Purchases.create(
	{
        id: sequelize.literal('DEFAULT'),
		created_at: sequelize.literal('CURRENT_TIMESTAMP'),
        name: body.name,
        address: body.address,
        state: body.state,
        zipcode: body.zipcode,
        user_id: body.user_id,
    })
	.then((result) => 
	{
        res.json(result);
        res.end();
    });
});

//Add new users through model
app.put('/users', (req, res, next) =>
{
    const body = req.body;
    Users.create(
	{
        id: sequelize.literal('DEFAULT'),
		email: body.email,
		password: body.password,
		details: body.details,
		created_at: sequelize.literal('CURRENT_TIMESTAMP'),
		deleted_at: body.deleted_at
    })
	.then((result) => 
	{
        res.json(result);
        res.end();
    });
});



///Question 6
//GET /products
app.get('/products', (req, res, next) => 
{
	Products.findAll(
	{
		order: 
		[
			['id', 'ASC']
		]
	}).then((result) => 
	{
		res.json(result);
	});
});

//GET /products/:id
app.get('/products/:id', (req, res, next) => 
{
    const id = req.params.id;
 
    if (id !== undefined)
	{
        Products.findOne(
		{
            where: 
			{
                id: 
				{
                    [op.eq]: id
                }
            }
        }).then((result) =>
		{
            res.json(result);
            res.end();
        });
    } 
	else 
	{
        res.status(404);
        res.end();
    }
});

//POST /products/:id
app.post('/products/:id', (req, res, next) => 
{
    const id = req.params.id;
    const body = req.body;
	
    Products.update(
	{
        title: body.title,
        price: body.price,
        tags: body.tags
    }, 
	{
        where: 
		{
            id: 
			{
                [op.eq]: id
            }
        }
    }).then((result) => 
	{
        res.json(result);
        res.end();
    });
});

//PUT /products
app.put('/products', (req, res, next) => 
{
    const body = req.body;
	
    Products.create(
	{
        id: sequelize.literal('DEFAULT'),
        title: body.title,
        price: body.price,
        tags: body.tags,
        created_at: sequelize.literal('CURRENT_TIMESTAMP')
    }).then((result) => 
	{
        res.json(result);
        res.end();
    });
});

//DELETE /products/:id
app.delete('/products/:id', (req, res, next) => 
{
    const id = req.params.id;
 
    Products.destroy(
	{
        where: 
		{
            id: 
			{
                [op.eq]: id
            }
        }
    }).then((result) => 
	{
        res.json(result);
        res.end();
    });
});