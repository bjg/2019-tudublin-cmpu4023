const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const open_port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next()
})
const Sequ = require('sequelize')

const Sequelize = new Sequ(
{
	database: 'pgguide',
    username: 'jack',
    password: 'orbien',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: 
	{
        underscored: true,
        timestamps: false,
    }
})

const Products = Sequelize.define('products', 
{
    id: 
	{
        type: Sequ.INTEGER,
		field: 'id',
        autoIncrement: true,
        primaryKey: true
    },
    title: 
	{
        type: Sequ.STRING,
    },
    price: 
	{
        type: Sequ.NUMERIC,
    },
    created_at: 
	{
        type: Sequ.DATE,
    },
    deleted_at: 
	{
        type: Sequ.DATE,
    },
    tags: 
	{
        type: Sequ.ARRAY(Sequ.STRING),
    }
})

Sequelize.authenticate()
    .then(() => 
	{
		
        console.log('Connection opened \nInitializing...');
		
		//GET Products
        app.get('/api/getProducts', async (request, response) => 
		{
            const search = request.query.name ? 
			{ where: 
				{ title: request.query.name } 
			} : {}
            response.json(await Products.findAll(search))
        })

		//GET Products by ID
        app.get('/api/getProducts/:id', async (request, response) => 
		{
            const products = await Products.findOne({
                where: {
                    id: request.params.id,
                },
            })

            if (!products) 
			{
				response.send('This product could not be found')
                response.statusCode = 400
            }

            response.json(products)
        })
		
		//PUT Products
        app.put('/api/putProducts/:id', async (request, response) => 
		{
            const products = await Products.findOne({
                where: 
				{
                    id: request.params.id,
                },
            })

            if (!products) 
			{
				response.send('This product could not be found')
                response.statusCode = 400

            }
            products.update(request.body)
                .then(result => response.json(result))
                .catch(err => 
				{
                    response.statusCode = 400
                    response.json(err)
                    response.cod
                })
        })
		
		//POST Products
        app.post('/api/postProducts', (request, response) => 
		{
            const products = Products.build(request.body) 
            products.save()
                .then(result => 
				{ response.json(result) })
                .catch(err => 
				{
                    response.statusCode = 400
                    response.json(err)
                    response.cod
                })
        })
		

		
		//DELETE Products
        app.delete('/api/deleteProducts/:id', async (request, response) => 
		{
            const products = await Products.findOne(
			{
                where: 
				{
                    id: request.params.id,
                },
            })

            if (!products) 
			{
                response.statusCode = 400
                response.send('This product could not be found')
            }

            products.destroy()
            response.end()
        })

		app.listen(open_port, () => console.log(`Now available on port: ${open_port} \nCtrl + C to close, NOT Ctrl + Z.. fg to fix`))
    })
    .catch((err) => 
	{
        console.log('Initialization has failed! Error: ', err)
    }) 