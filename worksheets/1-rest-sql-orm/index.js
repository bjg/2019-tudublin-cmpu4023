var express = require("express");
var app = express();
var http = require('http');
var massive = require("massive");
var connectionString = "postgres://postgres:Barang03@localhost/pgguide";

massive(connectionString).then(massiveInstance => {
    app.set('db', massiveInstance);
    http.createServer(app).listen(3000);

 app.get("/users",(req,res) =>{
        massiveInstance.query("select email, details from users order by created_at")
            .then((result) =>{
                res.send(result);
            })
    });

  app.get("/users/:id",(req,res) =>{
    var id = req.params.id
        massiveInstance.query("select details from users where id = $1",[id])
            .then((result) =>{
                res.send(result);
            })
    });

  app.get("/products",(req,res) =>{
    if(req.query.name == undefined)
    {
        massiveInstance.query("select * from products")
            .then((result) =>{
                res.send(result);
            })
    }

    // PART 2 EXTENDED
    // else
    // {
    //    massiveInstance.query(//http://localhost:3000/products?name=Dictionary';Delete from products where title = Dictionary;-- 
    //     "select * from products where title = '" + req.query.name + "';")
    //            .then(items => {
    //                    res.json(items);
    //            });
       
    // }

    // PART 3 - PARAMETERISED
    // massiveInstance.query("select * from products where title = $1",[title])

    // PART 3 - STORED PROCEDURE
    // massiveInstance.getproductbytitle(req.query.name)
                        // .then(items => {
                        //         res.json(items);
                        // });


  });

    app.get("/products/:id",(req,res) =>{
    var id = req.params.id
        massiveInstance.query("select * from products where id = $1",[id])
            .then((result) =>{
                res.send(result);
            })
    });

    app.get("/purchases",(req,res) =>{
        massiveInstance.query("select name, address, email, price, quantity FROM purchases A JOIN users B on (A.user_id = B.id) join purchase_items on (purchase_id = A.id) order by price desc;").then((result) =>{
                res.send(result);
            })
    });


});