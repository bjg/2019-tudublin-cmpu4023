const express = require("express");
const massive = require("massive");
const app = express();
const port = 3000;

//Connecting to postgres db
massive({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'jordan1',
    ssl: false,
}).then( instance => {
    app.set('db', instance);
});

//Information message if the user forgets the endpoint
app.get('/', (req, res) => res.send('Please use an endpoint from the labsheet'));

app.listen(port, () => console.log('App listening on port ${port}'));

//PART 1 - Using Node, Express and Massive to create HTTP API endpoints

// ** GET /users ** 
app.get('/users', (req, res) => {
    app.get('db').users.find({}, {
        columns: {
            email: 'email',
            sex: "details::json->>'sex'",
        },
        orderBy: [
            {
              field: 'created_at',
              direction: 'desc'
            }  
          ]
    }).then(output => {
        res.send(output);
    });
});


//** GET /users/:id **
app.get('/users/:id', (req, res) => {
    app.get('db').users.find({
        id: req.params.id
    },
    {
        columns: {
           email: "email",
           sex: "details::json->>'sex'"
        }
    }).then(output => {
        res.json(output);
    });
});


//** GET /products **
app.get('/products', (req, res) => {
    app.get('db').products.find({}, {
        columns: {
            title: "title",
            price: "price"
        },
        orderBy: [
            {
                field: 'price',
                direction: 'asc'
            }
        ]
    }).then(output => {
        res.json(output);
    })
});


//** GET /products/:id **
app.get('/products/:id', (req, res) => {
    app.get('db').products.find({
        id: req.params.id
    }).then(output => {
        res.json(output);
    });
});


//** GET /purchases **
app.get('/purchases', (req,res) => {
    app.get('db').query(
       'SELECT name as reciever_name, address as reciever_address' +
              'email as purchaser_email, purchase_items.price as itemPrice' +
              'purchase_items.quantity as itemQuantity, purchase_items.state as itemStatus' +
              'FROM purchases JOIN users ON (purchases.user_id = users.id)' +
              'JOIN purchase_items ON (purchases.id = purchase_items.purchase_id)' +
              'ORDER BY purchase_items.price DESC'
    ).then(output => {
        res.json(output);
    })/*.catch(error => {
        res.json({"error": ("Something went wrong")});
    })*/
});

//PART 2 - Bad SQL injection

//** GET /products[?name=string]
