const express = require('express')
const app = express()
const port = 3000
const http = require('http');

app.get('/', (req, res) => res.send('Hello Wafafaforld!'))

app.listen(port, () => console.log(`Example app listenaf alkfkqaf jhing on port ${port}!`))


const massive = require('massive');

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'password',//Put in password
}).then(instance => {
    app.set('db', instance);

// Part 1
    app.get('/users', (req, res) => 
    {
        app.get('db').users.find(
        {


        },
        {
            order: [{field: 'created_at', direction: 'desc'}],
            exprs: {
                email: 'email'
              },
            
        }
        ).then(users => {
        res.json(users);
      });
    });

    app.get('/users', (req, res) => 
    {
        app.get('db').users.find(
        {

            id: 4  

        },
        {
            order: [{field: 'created_at', direction: 'desc'}],
            exprs: {
                email: 'email'
              },
            
        }
        ).then(users => {
        res.json(users);
      });
    });


    /*Products 
    app.get('/products', (req, res) => 
    {
        app.get('db').products.find(
        {



        },
        {
            
            
        }
        ).then(users => {
        res.json(users);
      });
    });*/
    

    app.get('/purchases', (req, res) => 
    {
        app.get('db').products.find(
        {

            

        },
        {
            
            
        }
        ).then(users => {
        res.json(users);
      });
    });

    /*.then(db => {
        
        
        //Part 2 string localhost:3000/products"/ update products where title = "dictionary";--
        
        app.get('/products', (req, res) => db.query("SELECT * FROM products").then(res =>{
            
            console.log(res)
        }
        ))*/

    
		
    
});



    //part 2 used for the sql injection 
    //string used localhost:3000/products/Dictionary'; DELETE FROM users WHERE id=1;
    /*
    then(db => {
        
        app.get('/products', (req, res) => db.query("SELECT * FROM products").then(res =>{
            
            console.log(res)
        }
        ))
        */
        
    //Part 3
    app.get('/products', (req, res) => {
     //SAFE ALTERNATIVE USING PARAMETERISED QUERY    
    if(req.query.name != null)
    {
        app.get("db").products.find({or:[{'title like':"%"+req.query.name+"%"}]}, {
        order:[{field: "price",
        direction: "asc"}]
    })
    .then(result => {res.json(result);})

    /*SAFE ALTERNATIVE USING STORED PROCEDURE
		app.get("db").get_products_by_title(req.query.name)
		.then(result => {res.json(result);})*/
    }
    else{
        
        app.get("db").products.find({}, {
            order:[{field: "price",
            direction: "asc"}]
        })
        .then(result => {res.json(result);})
    }
});



    /*db => {

    app.get('/users', (req, res) => db.query("SELECT email, details FROM users ORDER BY created_at DESC").then(res =>{

        console.log(res)
    }
    ))*/

    /*app.get('/products', (req, res) => db.query("SELECT * FROM products ORDER BY created_at DESC").then(res =>{

        console.log(res)
    }
    ))

   

});*/