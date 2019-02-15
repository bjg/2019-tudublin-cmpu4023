var express = require("express");
var app = express();
var http = require('http');
var massive = require("massive");
var connectionString = "postgres://postgres:Barang03@localhost/pgguide";

massive(connectionString).then(massiveInstance => {
    app.set('db', massiveInstance);
    http.createServer(app).listen(3000);

    app.get("/",(req,res) => {
        res.send ("Hello World");
        console.log("List of Tables \n" + massiveInstance.listTables());
    });

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
        massiveInstance.query("select * from products order by deleted_at")
            .then((result) =>{
                res.send(result);
            })
    });

    app.get("/products/:id",(req,res) =>{
    var id = req.params.id
        massiveInstance.query("select * from products where id = $1",[id])
            .then((result) =>{
                res.send(result);
            })
    });

    app.get("/purchases",(req,res) =>{
        massiveInstance.query("select a.price, a.quantity, a.state, b.name, b.address, c.email from purchase_items a join purchases b on a.purchase_id = b.id join users c on b.user_id = c.i order by a.price desc")
            .then((result) =>{
                res.send(result);
            })
    });


});