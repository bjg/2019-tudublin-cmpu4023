const Sequelize = require('sequelize');
const express = require('express');
const app = express();
app.use(express.urlencoded())
const port = 3000;


//const sequelize = new Sequelize('postgres://Eoghan%20Quirke:eoghan@localhost:5432/enterpise');
const sequelize = new Sequelize('enterprise', 'Eoghan Quirke', 'eoghan', {
    host: "localhost",
    dialect: 'postgres',
    define: {
        timestamps: false
    }
});
const Model = require("./models/index")
//Init relations
Model.purchases.belongsTo(Model.users);
Model.purchases.hasMany(Model.purchase_items);
Model.users.hasMany(Model.purchases);
Model.purchase_items.belongsTo(Model.purchases);
Model.purchase_items.belongsTo(Model.products);
Model.products.hasMany(Model.purchase_items);

app.get('/products/:id', (req, res) => {

		Model.products.findOne({where:{id:req.params.id}})
		.then(results => {
			res.json(results);
		})
		.catch(err => {res.send("\"error\":\"Products not Found\"")})	
})


app.get('/products', (req, res) => {
	if(req.query.name != null){		
		Model.products.findAll({where:{title:{[Sequelize.Op.like]:"%"+req.query.name+"%"}}})
		.then(results => {
			res.json(results);
		})
		.catch(err => {res.send("\"error\":\"Products not Found\"")})
	}
	else{
		Model.products.findAll({})
		.then(results => {
			res.json(results);
		})
		.catch(err => {res.send("\"error\":\"Products not Found\"")})
	}
	
})

app.post('/products', (req, res) => {
	console.log(req.body.tags);
	tags = req.body.tags.split(" ")
	prod = Model.products.build({id:req.body.id, title:req.body.title, price:req.body.price, created_at:new Date(Date.now()), tags: tags});
	prod.save()
	.then(() => {
		res.json(prod.get({plain:true}));
	})
	.catch(err => {res.send("\"error\":\"Product already exists\"")});
		
})

app.put('/products/:id', (req, res) => {

	Model.products.findOne({where:{id:req.params.id}})
	.then(product => {
		product.title = req.body.title != null ? req.body.title : product.title;
		product.price = req.body.price != null ? req.body.price : product.price;
		product.tags = req.body.tags != null ? req.body.tags.split(" ") : product.tags;
		product.save()
		.then(() => {
			res.json(product.get({plain:true}));
		})
		.catch(err => {res.send("\"error\":\"Update Failed\"")});
	})
	.catch(err => {res.send("\"error\":\"Instance Not Found\"")});
	
})

app.delete('/products/:id', (req, res) => {

		Model.products.findOne({where:{id:req.params.id}})
		.then(product => {
			product.destroy()
			.then(() => {
				res.json(product.get({plain:true}));
			})
		.	catch(err => {res.send("\"error\":\"Delete Failed\"")});
		})
		.catch(err => {res.send("\"error\":\"Instance Not Found\"")});

		
})

app.get('/users/:id', (req, res) => {

		Model.users.findOne({where:{id:req.params.id}})
		.then(results => {
			res.json(results);
		})
		.catch(err => {res.send("\"error\":\"User not Found\"")})	
})


app.get('/users', (req, res) => {

		Model.users.findAll({})
		.then(results => {
			res.json(results);
		})
		.catch(err => {res.send("\"error\":\"Error fetching users\"")})
	
})


app.get('/purchases', (req, res) => {
		
		//Sequelize Randomly changes the aliases of some fields making projection annoying
		Model.purchases.findAll({include:[{model:Model.users, required:true}, {model:Model.purchase_items, required:true}]})
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			res.send("\"error\":\"Purchases not Found\"");
			console.log(err);
		})
	
})

app.listen(port, () => console.log('Example app listening on port 3000!'));