const express = require('express')
const Sequelize = require('sequelize')

const app = express()

var sequelize = new Sequelize('postgres', 'postgres', 'doyler1995', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

 
});

const port = 3000

sequelize.authenticate().then(() => 
  {
    console.log('SUCCESS')
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
  })
  .catch(err => 
  {
    console.error('ERROR:', err)
  })
  
var users = sequelize.define('users', {
  id: 
  {
    type: Sequelize.INTEGER,
    primaryKey: true,
	autoIncrement: true
  },
  email: {
    type: Sequelize.STRING
  },
  password:{
	type: Sequelize.STRING
  },
  details:
  {
	  type: Sequelize.STRING
  },
  created_at:
  {
	  type: Sequelize.DATE,
	  defaultValue: sequelize.literal('NOW()')
  },
  deleted_at:
  {
	type: Sequelize.DATE,
    defaultValue: null
  }
  
},
{
  timestamps: false,
});

//sample code -- check users is  working

/*
 users.create(
 {
   email: 'chloe@example.com' ,
   password: '1234',
   details: 'sex=>F'
 }).then( users => {
   users.save()
 }).catch(err => {
   console.log(err)
 })
*/



var purchases = sequelize.define('purchases',
{
	id: 
	{
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	created_at: 
	{
     type: Sequelize.DATE,
	  defaultValue: sequelize.literal('NOW()')
	},
	name:
	{
		type: Sequelize.STRING
	},
	address:
	{
		type: Sequelize.STRING
	},
	state:
	{
		type: Sequelize.STRING
	},
	zipcode:
	{
		type: Sequelize.INTEGER
	},
	user_id:
	{
		type: Sequelize.INTEGER
	}
},{
  timestamps: false,
});


//purchases.belongsTo(users);
/*
//testing purchases are created

 purchases.create(
 {
   name: 'chloe2' ,
   address: '49 street',
   state: 'DU',
   zipcode:'1234',
   user_id:'51'
 }).then( users => {
   users.save()
 }).catch(err => {
   console.log(err)
 })
*/


var items = sequelize.define('purchase_items',
{
	id: 
	{
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	purchase_id:
	{
		type: Sequelize.INTEGER
	},
	product_id:
	{
		type: Sequelize.INTEGER
	},
	price:
	{
		type: Sequelize.INTEGER
	},
	quantity:
	{
		type: Sequelize.INTEGER
	},
	state:
	{
		type: Sequelize.STRING
	}
	},{
  timestamps: false,
});

/*

//testing itemsbare created
 items.create(
 {
   purchase_id: '1001' ,
   product_id: '20',
   price: '14.99',
   quantity:'1',
   state:'AB'
 }).then( users => {
   users.save()
 }).catch(err => {
   console.log(err)
 })
 */
 var products = sequelize.define('products',
{
	id: 
	{
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	title:
	{
		type: Sequelize.STRING
	},
	price:
	{
		type: Sequelize.INTEGER
	},
	created_at:
	{
		type: Sequelize.DATE,
		defaultValue: sequelize.literal('NOW()')
	},
	deleted_at:
	{
		type: Sequelize.DATE,
    defaultValue: null
	},
	tags: 
	{
        type: Sequelize.ARRAY(Sequelize.TEXT)
    }
	},{
  timestamps: false,
});


/*
//testing products are created
 products.create(
 {
   title: 'Romantic Comedy' ,
   price: '15.99',
   tags: '{Movie}',
 }).then( users => {
   users.save()
 }).catch(err => {
   console.log(err)
 });
 
 */
//Part 6
//Get all products 
 app.get('/products', function(request, response) 
 {
    products.findAll().then(get_info => {
    response.send(get_info);
  })
});

//Show details of the specified products


 app.get('/products:id', function(request, response) 
 {
    products.findAll().then(get_info => 
	{
    response.send(get_info);
  })
});


// GET product by ID
app.get('/products/:id', function(request, response) 
{
    products.findByPk(request.params.id).then(get_info => 
	{
      response.send(get_info);
    })
});


// POST a new product instance
//localhost:3000/product?title=chloe&price=14.9&tags=["test1","test2"]


app.post('/products', function(request, response)
 {
    products.create(
	{
        title: request.query.title,
        price: request.query.price,
        tags: JSON.parse(request.query.tags)
    })
	.then(success => 
	{
        success.save()
        response.send('Success')
    })
	.catch(error => 
	{
        response.sendStatus(500)
        console.log('Error:' + error)
    })
});
//changing the posts price that i created
//localhost:3000/products/23
app.put('/products/:id', function(request, response)
{
    products.update({ price: '15.99' }, 
	{ where: 
	{ id: request.params.id } })
        .then(
            response.send('Success')
        )
        .catch(error => 
		{
            response.send('Error:' + error)
        })
});

//deleting 
//localhost:3000/products/23
app.delete('/products/:id', function(request, response) 
{
    products.destroy(
	{
        where: { id: request.params.id }
    }).then(() => 
	{
        response.status(200).send('Deleted');
    }).catch(error => {
        res.send('Error:'+error )
    })
});
