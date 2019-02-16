const express = require('express');
const http = require('http');
const massive = require('massive');

const app = express();
app.listen(3000);
//http.createServer(app).listen(3000);
massive
(
    {
	    host: 'localhost',
        port: 5432,
        database: 'pgguide',
        user: 'aaron',
        password: 'Password',
        enhancedFunctions: true
    }
)
.then(instance =>{
        db = instance;
    });

   // Part 1 a.List all users email and sex in order of most recently created. Do not include password hash in your output
app.get('/users', (req, res) => {
    db.users.find({},{
            fields: ["email", "details::json"],
            order: [{
                field:'created_at', 
                direction: 'desc',
            }]
    })
    .then(items => {
        res.json(items);
    })
    .catch(() => {
        console.log('Error with getting All users');
    });        
});
// part 1 b. Show above details of the specified user
app.get('/users/:id', (req, res) => {
    db.users.findOne(req.params.id,
    {
            fields: ["email", "details::json"]
    })
    .then(items => {
        res.json(items);
    })
    .catch(() => {
        console.log('Error gettins a specific user id');
    });        
});

//Part 1 d. Show details of the specified products
app.get('/products/:id', (req, res) => {
    db.products.findOne(req.params.id,
    {})
    .then(items => {
        res.json(items);
    })
    .catch(() => {
        console.log('Error with showing a sepcific id');
    });        
});

// Part 1 e. List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, quantity and delivery status of the purchased item. Order by price in descending order
app.get('/purchases', (req, res) => {
    db.query(
        `select purchases.name, purchases.address, users.email,purchase_items.price, purchase_items.quantity, purchase_items.state 
        from users, purchases, purchase_items
        where purchase_items.purchase_id = purchases.id
        and purchases.user_id =users.id
        order by price desc;`,
        {})
    .then(items => {
        res.json(items);
    })
    .catch(() => {
        console.log('Error in purchases');
    });        
});


//Part 1 c. List all products in ascending order of price 
app.get('/products', (req, res) => {
    console.log("Being Passed in "+req.query.name);
    if(req.query.name == undefined)
    {
        db.products.find({},{
            order: [{
                field:'price', 
                direction: 'asc',
            }]
        })
    .then(items => {
        res.json(items);
        });        
    }
//Part 2 extend the product indexing endpoint to allow the filtering of products by name as follows   
//    else{
//         db.query(
//             //http://localhost:3000/products?name=Book';Delete from products where title = Book;--
//         "select * from products where title = '" + req.query.name +"';"
//         )
//         .then(items => {
//             res.json(items);
//         });
//     }
// });

//Part 3a. Using a parameterised query
//     else{
//         db.query(
//         "select * from products where title = ${name}", {name: req.query.name}
//         )
//         .then(items => {
//             res.json(items);
//         }).catch(() => {
//             console.log('Error in parameterised query');
//         });
//     }
// });
//Part 3b. Using a stored procedure using SQL
    else{
         db.findproducts(req.query.name)
        .then(items => {
            console.log("HERE??"+ items.json)
            res.send(items);
        }).catch(() => {
            console.log('Error in parameterised query');
        });
    }
});