const express = require('express') 
const Sequelize = require('sequelize') 
const bodyParser = require('body-parser') 
const app = express() 
const port = 3000 

app.use(bodyParser.urlencoded({extended: true })) 
app.use(bodyParser.json()) 

const sequelize = new Sequelize('postgres://tom:Trollalot121@localhost:5432/pgguide')

//Authenticate connection
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.')
}).catch(err => {
    console.error('Unable to connect to the database: ', err)
})

//operators
const operator = Sequelize.Op

//Model for user object
const Users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    email: { type: Sequelize.STRING, field: 'email' },
    password: { type: Sequelize.STRING, field: 'password' },
    details: { type: Sequelize.HSTORE, field: 'details' },
    created_at: { type: Sequelize.DATE },
    deleted_at: { type: Sequelize.DATE }
}, {
    timestamps: false
})

//Model for Product object
const Products = sequelize.define('products', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    title: { type: Sequelize.STRING },
    price: { type: Sequelize.NUMERIC },
    tags: { type: Sequelize.ARRAY(Sequelize.STRING)},
    created_at: { type: Sequelize.DATE },
    deleted_at: { type: Sequelize.DATE }
}, {
    timestamps: false
}) 


//Model for purchases
const Purchases = sequelize.define('purchases', {

    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    name: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    zipcode: { type: Sequelize.INTEGER},
    state: { type: Sequelize.STRING},
    created_at: { type: Sequelize.DATE },
    user_id: { type: Sequelize.INTEGER }
}, {
    timestamps: false
}) 

//Model for Purchase_Items
const Purchase_Items = sequelize.define('purchase_items', {

    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    purchase_id: { type: Sequelize.INTEGER},
    product_id: { type: Sequelize.INTEGER },
    price: { type: Sequelize.NUMERIC},
    quantity: { type: Sequelize.INTEGER},
    state: { type: Sequelize.STRING}
},{
    timestamps: false
})


// Populating Tables
for(let i = 0; i < 5; ++i) {
    Users.create({
        id: Sequelize.literal('DEFAULT'),
        email: `generated_${i}_email@tom.ie`,
        password: `pass_for_${i}`,
        details: undefined,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP')
    }).then((user) => {
        console.log(`created user: ${i}`)
    })

    Products.create({
        id: Sequelize.literal('DEFAULT'),
        title: `title_${i}`,
        price: i,
        tags: undefined,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        deleted_at: Sequelize.literal('CURRENT_TIMESTAMP')
    }).then((product) => {
        console.log(`created product: ${i}`)
    })

    Purchases.create({
        id: Sequelize.literal('DEFAULT'),
        name: `name_${i}`,
        address: `address_${i}`,
        zipcode: i,
        state: `S${i}`,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        user_id: Sequelize.literal('DEFAULT')
    }).then((product) => {
        console.log(`created purchase: ${i}`)
    })

    Purchase_Items.create({
        id: Sequelize.literal('DEFAULT'),
        purchase_id: Sequelize.literal('DEFAULT'),
        product_id: Sequelize.literal('DEFAULT'),
        price: i,
        quantity: i,
        state: `S${1}`
    }).then((product) => {
        console.log(`created purchase_item: ${i}`)
    })
}




//Find products in ascending price - allows for ?name= to be provided
app.get('/products', (req, res, next) => {
    const name = req.query.name

    //If name provided - find all products related to that name
    if (name !== undefined) {
        Products.findAll({
            where: {
                title: {
                    [operator.iLike]: `%${name}%`
                }
            },
            order: [
                ['price', 'ASC']
            ]
        }).then((products) => {
            res.json(products) 
            res.end() 
        }) 
    } else {
        Products.findAll({
            order: [
                ['price', 'ASC']
            ]
        }).then((products) => {
            res.json(products) 
        }) 
    }
}) 

//Find product via ID
app.get('/products/:id', (req, res, next) => {
    const id = req.params.id 

    if (id !== undefined && !isNaN(id)) {
        Products.findOne({
            where: {
                id: {
                    [operator.eq]: id
                }
            }
        }).then((product) => {
            res.json(product) 
            res.end() 
        }) 
    } else {
        res.status(404) 
        res.end() 
    }
}) 

//Create new product
app.put('/products', (req, res, next) => {
    const body = req.body 
    Products.create({
        id: sequelize.literal('DEFAULT'),
        title: body.title,
        price: body.price,
        tags: body.tags,
        created_at: sequelize.literal('CURRENT_TIMESTAMP')
    }).then((product) => {
        res.json(product) 
        res.end() 
    }) 
}) 

// Update existing product
app.post('/products/:id', (req, res, next) => {
    const id = req.params.id 
    const body = req.body 

    Products.update({
        title: body.title,
        price: body.price,
        tags: body.tags
    }, {
        where: {
            id: {
                [operator.eq]: id
            }
        }
    }).then((success) => {
        res.json(success) 
        res.end() 
    }) 
}) 

//Remove existing product
app.delete('/products/:id', (req, res, next) => {
    const id = req.params.id 

    Products.destroy({
        where: {
            id: {
                [operator.eq]: id
            }
        }
    }).then((success) => {
        res.json(success) 
        res.end() 
    }) 
}) 

app.listen(port, () => {
    console.log(`Sequelize.js listening on port ${port}!`)
}) 