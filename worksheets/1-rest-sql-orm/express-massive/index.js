const express = require('express')
const app = express()
const port = 3000

//massive stuff
const massive = require('massive');

massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide',
    user: 'ronan',
    password: 'password',
    ssl: false,
    poolSize: 10
}).then(db => {
    console.log("Connected");
    console.log(db.listTables());
    
    //Routes    
    app.get('/', (req, res) => res.send("Hello World"));

    //all users
    app.get('/users', (req, res) => {
        let obj_arr = []
        
        db.users.find({},
            {
                order: [{field: 'created_at', direction: 'desc'}]
            }).then(users => {
                console.log(users);

                for(i = 0; i < users.length;i++){
                    var obj = new Object();
                    obj.email = users[i].email;
                    obj.details = users[i].details;

                    obj_arr.push(obj);
                    
                }
            res.json(obj_arr);
            })
    });

    //specific user
    app.get('/users/:id', (req, res) => {
        
        db.users.findOne({
            id: req.params.id
        }).then(result => {
            console.log(result);
            res.json(result);
        });
        
    });

    //products
    app.get('/products', (req, res) => {
        let obj_arr = []
        
        db.products.find({},
            {
                order: [{field: 'price', direction: 'asc'}]
            }).then(products => {
                console.log(products);

                for(i = 0; i < products.length;i++){
                    //console.log(products[i]);
                    var obj = new Object();
                    obj.title = products[i].title;
                    obj.price = products[i].price;
                    obj.tags = products[i].tags;
                    
                    obj_arr.push(obj);
                }
            res.json(obj_arr);
            })
    });

    //specific product
    app.get('/products/:id', (req, res) => {
        
        db.products.findOne({
            id: req.params.id
        }).then(result => {
            console.log(result);
            res.json(result);
        });
        
    });
    app.get('/purchases', (req, res) => {

        let obj_arr = []
 
        db.query(
         "select * from purchases"
         ).then(results => {

            console.log(results);
             for(i = 0; i < results.length; i++){
                /* 
                var obj = new Object();
                 obj.purchase_id = results[i].purchase_id;
                 obj.title = results[i].title;
                 obj.name = results[i].name;
                 obj.address = results[i].address;
                 obj.price = results[i].price;
                 obj.quantity = results[i].quantity;
 
                 obj_arr.push(obj);   
                 */
             }
             res.json(results);
         });
     });

    app.get('/purchase_items', (req, res) => {

       let obj_arr = []

       db.query(
        "select purchase_id,title,name,address,purchase_items.price,quantity from purchase_items \
        join purchases on purchases.id = purchase_items.purchase_id \
        join products on products.id = purchase_items.product_id \
        order by purchase_items.price desc"
        ).then(results => {
            
            for(i = 0; i < results.length; i++){
                var obj = new Object();
                obj.purchase_id = results[i].purchase_id;
                obj.title = results[i].title;
                obj.name = results[i].name;
                obj.address = results[i].address;
                obj.price = results[i].price;
                obj.quantity = results[i].quantity;

                obj_arr.push(obj);   
            }
            res.json(obj_arr);
        });
    });

    //SQL injection
    app.get('/products_unsafe/:title', (req,res) => {
        let userString = req.params.title;
        //0 OR 1=1 selects everything
        const sql = `SELECT * FROM products WHERE id = ${userString}`

       let obj_arr = []

        db.query(
            sql
        ).then(products => {
            for(i = 0; i < products.length;i++){
                //console.log(products[i]);
                var obj = new Object();
                obj.title = products[i].title;
                obj.price = products[i].price;
                obj.tags = products[i].tags;
                
                obj_arr.push(obj);
            }
        res.json(obj_arr);
        })
    });

    app.get('/testdb', (req,res) => {
        res.send(db.listTables());
    });

    //SQL injection prevention
    app.get('/products_safe/:title', (req,res) => {
        let userString = req.params.title;
        let sql = "SELECT * FROM products WHERE id = ${id}";

        db.query(
            sql,
            {id: userString},
          ).then(query => {
              console.log(query);
              res.send(query);
          }).catch((err) => {
              res.send(err);
          });;
    });

    //SQL injection prevention stored procedure
    app.get('/products_safe_two/:title', (req,res) => {
        let userString = req.params.title;
        
        /*
        //This isnt working. Error: attempt to overwrite function at get_safe is not allowed
        db.get_safe(userString).then(result =>{
            for(i = 0; i < result.length;i++)
            {
                console.log(result[i])
            }
            res.send(result);
        }).catch(error =>{
            res.send(error);
        })
        */
    });

});

app.listen(port, () => console.log('Example app listening on port ' + port))