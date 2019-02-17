const express = require('express')
const massive = require('massive');

const app = express()
const port = 3002
var db;

//Connection to the Postgress database
massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide',
    user: 'usr',
    password: 'password'
}).then((ddb) => {

    db = ddb
});

//The REST server will listen at port 3002 for incoming requests
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//Default endpoint
app.get('/', (req, res) => res.send('Hello World!'))

//List all users email and sex in order of most recently created.
app.get('/users', (req, res) => {
    db.users.find({}, {
        fields: [
            "email",
            "details::json"
        ],
        order: [{
            field: 'created_at',
            direction: 'desc'
        }]
    }).then(items => {

        var users = items.map(user => {
            return {
                'email': user.email,
                "sex": (user.details) ? user.details.sex : "Null"
            }
        })
        console.log(users)
        res.json(users)
    })
});

// Search specific user by id
app.get('/users/:id', (req, res) => {
    db.users.find({
        id: req.params.id
    }, {
        fields: [
            "email",
            "details::json"
        ],
        order: [{
            field: 'created_at',
            direction: 'desc'
        }]
    }).then(items => {

        var user = {
            "email": items[0].email,
            "sex": (items[0].details.sex) ? items[0].details.sex : "Null"
        }

        res.json(user)
    })
})

//List all products in ascending order of price
app.get('/products', (req, res) => {
    db.products.find({}, {
        order: [{
            field: "price",
            direction: "asc"
        }]
    }).then(items => {
        res.json(items)
    })
})

//Show details of the specified products
app.get('/products/:id', (req, res) => {
    db.products.find({
        id: req.params.id
    }).then(items => {
        res.json(items)
    })
})

//List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, 
//quantity and delivery status of the purchased item. Order by price in descending order
app.get('/purchases', (req, res) => {
    db.query(
        "select name, address, email, price, quantity from purchases pu join users u on(pu.user_id = u.id) join purchase_items pi on (pu.id = pi.purchase_id) order by price DESC"
    ).then(items => {
        console.log(items);
        res.json(items)
    })
})

//-----------------PART 2

// //Injection is possible - RAW SQL QUERY
app.get('/products', (req, res) => {

    if (req.query.name) {
        db.query(
            'Select * from products where title = \'' + req.query.name + '\''
        ).then(items => {
            res.json(items)
        })

    } else {

        db.products.find({}, {
            order: [{
                field: "price",
                direction: "asc"
            }]
        }).then(items => {
            console.log(items);
            res.json(items)
        })
    }
})


//Injection not possible: parametrised query
app.get('/products', (req, res) => {
    if (req.query.name) {
        db.products.find({
            title: req.query.name
        }, ).then(items => {
            console.log(items);
            res.json(items)
        })

    } else {

        db.products.find({}, {
            order: [{
                field: "price",
                direction: "asc"
            }]
        }).then(items => {
            console.log(items);
            res.json(items)
        })
    }
})


//Injection is not possible - Stored Procedure
app.get('/products', (req, res) => {

    if (req.query.name) {
        db.query(
            'Select * From selectProduct( \'' + req.query.name + '\');'
        ).then(items => {
            console.log(items);
            res.json(items)
        })

    } else {

        db.products.find({}, {
            order: [{
                field: "price",
                direction: "asc"
            }]
        }).then(items => {
            console.log(items);
            res.json(items)
        })
    }
})