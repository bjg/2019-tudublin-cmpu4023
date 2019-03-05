const express = require("express");
const app = express();
const models = require("./server/models/index");
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get("/",(req,res)=>{
    res.send("Hello world");
});


//Get requests - all products
app.get("/products",(req,res)=>{
    models.Products_Sequelize.findAll({})
    .then(products => {
        res.json(products);
    });
});

//get a product
app.get("/products/:id",(req,res)=>{
    models.Products_Sequelize.find({
        where:{
            id:req.params.id
        }
    })
    .then(product => {
        res.json(product);
    })
});

//PUT, POST, DELETE

//create product
app.post("/products",urlencodedParser, (req,res) => {
    models.Products_Sequelize.create({
        title: req.body.title,
        price: req.body.price,
    }).then(product => res.json(product));
});

//update product
app.put("/products/:id",urlencodedParser,(req,res)=>{
    models.Products_Sequelize.find({
        where:{
            id: req.params.id
        }
    })
    .then(product =>{
        product.update({
            price:req.body.price,
        }).then(product => {
            res.json(product);
        })
    })
});

//delete product
app.delete("/products/:id",(req,res) => {
    models.Products_Sequelize.destroy({
        where:{
            id:req.params.id
        }
    }).then(product=>{
            res.sendStatus(200)
            res.send("Product deleted");
            res.end();
        })
})

app.listen(3000,()=>{
    console.log("Application is now listening http://127.0.0.1:3000");
})