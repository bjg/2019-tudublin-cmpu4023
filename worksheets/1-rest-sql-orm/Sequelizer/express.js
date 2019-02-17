//  Max MacDonald
//  C15740661

const express = require('express')
const bodyParser = require('body-parser')
const port = 3000
const app = express()
const { User, Product, Purchase, PurchaseItem } = require('./sequelize')

app.use(bodyParser.json())

// Get specific product by id
app.get('/products/:id', (req, res) => {
    Product.findById(req.params.id)
	.then(items => res.json(items))
})

// Get all product or specific product by title
app.get('/products', (req, res) => {
	let query;
    if(req.query.name) {
        query = Product.findAll({where: {title: req.query.name}})
    } else {
        query = Product.findAll()
    }
    return query.then(items => res.json(items))
})

// Create a new product instance
app.post('/products', (req, res) => {
    if(req.query.name && req.query.price) {
        Product.build({ title: req.query.name, price: req.query.price, created_at: new Date()})
		  .save()
		  .catch(function(error) {console.log(error)
		})
		output = 'New Product instance created with name = ' + req.query.name +
				' and price = ' + req.query.price
    } else {
        output = 'Please enter in a name and price for new product instance'
    }
    return res.send(output)
})

// Update a specific product by id
app.put('/products/:id', (req, res) => {
	Product.update(
	  { title: req.query.name },
	  { where: { id: req.params.id } }
	)
	.then(result =>
		Product.findById(req.params.id)
		.then(items => res.json(items))
	)
	.catch(err =>res.send(err))
})

// Delete specific product by id
app.delete('/products/:id', (req, res) => {
	Product.count({ where: { id: req.params.id } })
    .then(count => {
        if (count != 0) {
            Product.destroy({where: {id: req.params.id}})
			return res.send('Product with id = ' + req.params.id +  ' deleted')
        } else {
			return res.send('Product with id = ' + req.params.id + ' does not exist')
		}
	})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))