const express = require('express');

const massive = require('./database/massive');
const get_product = require('./sql/stored_procedures/get_product');

const PORT = 3000;

const app = express();

/* ---- Question 1 start block ---- 
    NOTE: please see the readme.md for directions for "briefly show how
          you did this"
    NOTE: question 1(p3) -> "GET/products" is contained in Question 2 block 
    for efficiency
*/
app.get('/users', (req, res) => {
    massive.then(db => {
        db.users.find({},{
            exprs: {
                email: "email",
                sex: "COALESCE(details::json->>'sex','undefined')"
            },
            order: [{
                field: 'created_at',
                direction: 'desc',
            }]
        })
        .then(allUsers => res.status(200).send(allUsers))
        .catch((err) => res.status(503).send(err));
    }).catch(err => res.status(503).send(err));
});

app.get('/users/:id', (req, res) => {
    massive.then(db => {
        db.users.find({id: req.params.id},{
            exprs: {
                email: "email",
                sex: "COALESCE(details::json->>'sex','undefined')"
            }
        })
        .then(user => user.length == 0 ? res.status(204).send(user) : res.status(200).send(user))
        .catch(err => res.status(503).send(err));
    }).catch(err => res.status(503).send(err));
});

app.get('/products/:id', (req, res) => {
    massive.then(db => {
        db.products.find({id: req.params.id})
        .then(product => product.length == 0 ? res.status(204).send(product): res.status(200).send(product))
        .catch(err => res.status(503).send(err));
    }).catch(err => res.status(503).send(err));
});

app.get('/purchases', (req, res) => {
    massive.then(db => {
        db.query(
           `SELECT name, address, USERS.email, PURCHASE_ITEMS.price, PURCHASE_ITEMS.quantity, PURCHASE_ITEMS.state  
            FROM PURCHASES 
            INNER JOIN USERS ON PURCHASES.user_id = USERS.id
            INNER JOIN PURCHASE_ITEMS ON PURCHASES.id = PURCHASE_ITEMS.purchase_id
            ORDER BY PURCHASE_ITEMS.price DESC`
        ).then(allPurchases => {
            res.status(200).send(allPurchases)
        }).catch(err => res.status(503).send(err));
    }).catch(err => res.status(503).send(err));
});

// ---- Question 1 end block ----

//  ----  Question 2 start block ---- 

app.get('/products', (req, res) => {

    if(!isEmpty(req.query)){
        massive.then(db => {
            /*
                the below statement causes an sql injection attack for the query. The below statement returns the product "Baby Book" (as expected) but also deletes product with id 13
                localhost:3000/products?title=Baby Book'; DELETE FROM purchase_items WHERE product_id = 13; DELETE FROM products WHERE id = 13; SELECT * FROM products WHERE title = 'Baby Book
            */
            db.query(
                "SELECT * from products WHERE title ='" + req.query.title + "' ORDER BY PRICE ASC"
            )
            .then(product => product.length == 0 ? res.status(204).send(product) : res.status(200).send(product))
            .catch(err => res.status(503).send(err));
        }).catch(err => res.status(503).send(err));
    }else{
        // question 1 part 3: find all products
        massive.then(db => {
            db.products.find({}, {
                order: [{
                    field: 'price',
                    direction: 'asc',
                    nulls: 'first'
                }]
            }).then(allProducts => res.status(200).send(allProducts))
            .catch(err => res.status(503).send(err))
        }).catch(err => res.status(503).send(err));
    }
});

// ---- Question 2 end block ----


// ---- Question 3a (parameterized query) start block ---- 

app.get('/products_parameterised', (req, res) => {
    if(!isEmpty(req.query)){
        massive.then(db => {
            db.query(
                `select * from products where title = ${title}
                ORDER BY PRICE ASC`,
                {title: req.query.title}
            ).then(product => product.length == 0 ? res.status(204).send(product) : res.status(200).send(product))
            .catch(err => res.status(503).send(err));
        }).catch(err => res.status(503).send(err));
    }else{
        res.redirect('/products')
    }
})

// ---- Question 3a (parameterized query) end block ----

// ---- Question 3b (stored procedure) start block ---- 


app.get('/products_stored', (req, res) => {
    if(!isEmpty(req.query)){

        get_product.then(() => {
            massive.then(db => {
                db.query(
                    "select * FROM get_product(${title})",
                    {title: req.query.title}
                ).then(product => product.length == 0 ? res.status(204).send(product) : res.status(200).send(product))
                .catch(err => res.status(503).send(err));
            }).catch(err => res.status(503).send(err));    
        }).catch(err => res.status(503).send(err));

    }else{
        res.redirect('/products')
    }
})

// ---- Question 3b (stored procedure) end block ---- 


let isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
});
