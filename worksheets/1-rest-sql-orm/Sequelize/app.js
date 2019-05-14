const express = require("express");
const app = express();
const models = require("./server/models/index");
const bodyParser = require("body-parser");
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/", (req, res) => {
    res.send("Home route");
});

//Part 6 from lab
//Routes
//get all products
//If you want to get a specific product using the title add the following query string to the end of the route
//?title=""
app.get("/products", (req, res) => {
    if (Object.keys(req.query).length !== 0) {
        models.seqProduct.find({
            where: {
                title: req.query.title
            }
        }).then(product => {
            res.json(product);
        })
    } else {
        models.seqProduct.findAll({})
            .then(products => {
                res.json(products);
            })
    }
});

/*get product by specific Id
* */
app.get("/products/:id", (req, res) => {
    models.seqProduct.find({
        where: {
            id: req.params.id
        }
    }).then(product => {
        res.json(product)
    })
});

//add a product using a post
//product data being added through the body of the post request
app.post("/products",urlencodedParser, (req, res) => {
    //check if there is data being passed in the body of the request object
    //
    if(!req.body){
        res.sendStatus(404);
    }else {
        models.seqProduct.create({
            title: req.body.title,
            price: req.body.price
        }).then(product => {
            console.log(`Product: ${product.title} was added to the database with an id of ${product.id}`);
            res.json(product);
        });
    }

});

//Update a product using its id..
//Data to be updated is passed through the body
//for this route We assume that we are only going to be updating the price of the product
app.put("/products/:id",urlencodedParser,(req,res) => {
    models.seqProduct.find({
        where:{
            id : req.params.id
        }
    }).then(product =>{
        product.update({
            price: req.body.price,
        }).then(product =>{
            res.json(product);
        })
    });
});

//deleting a product from an id
//
app.delete("/products/:id",(req,res) =>{
    models.seqProduct.destroy({
        where:{
            id : req.params.id
        }
    }).then(() => {
        res.sendStatus(200);
        res.send("Record deleted successfully");
        res.end();
    });
});


//Add a user through a query string using the following params
//?email=""&password=""&details={}&deleted_at=""
app.get("/addUser", (req, res) => {
    models.seqUser.create({
        email: req.query.email,
        password: req.query.password,
        details: req.query.details,
        deleted_at: req.query.deleted_at,
    }).then(user => res.json(user));
});

//add a product by adding this query string at the end of the route
//?title=""&price=&quantity=&tags=[]
app.get("/addProducts", (req, res) => {
    models.seqProduct.create({
        title: req.query.title,
        price: req.query.price,
        quantity: req.query.quantity
    }).then(product => {
        res.json(product);
    })
});

//list the pruchases table content
// Or if you want to add something to the table use the query string in this format
//?name="string"&address="string"&state="string"&zipcode=integer&created_at=timestamp&userId=integer
app.get("/purchases", (req, res) => {
    if (Object.keys(req.query).length !== 0) {
        models.seqPurchase.create({
            name: req.query.name,
            address: req.query.address,
            state: req.query.state,
            zipcode: req.query.zipcode,
            created_at: req.query.created_at,
            seqUserId: req.query.userId
        }).then(purchase => {
            res.json(purchase);
        })
    } else {
        models.seqPurchase.findAll({})
            .then(purchase => res.json(purchase));
    }

});


//list the contents of the purchase_items table
//or add data to the purchase_items table through the query string using this format
//?price=&quantity&state=""&purchaseId=&productId=
app.get("/purchase_items", (req, res) => {
    if(Object.keys(req.query)===0) {
        models.seqPurchase_Items.findAll({})
            .then(pi => res.json(pi));
    }else{
        models.seqPurchase_Items.create({
            price: req.query.price,
            quantity:req.query.quantity,
            state:req.query.state,
            seqPurchasesId: req.query.purchaseId,
            seqProductId: req.query.productId
        }).then(record => res.json(record));
    }
});

app.use(bodyParser.json);
app.listen(3001, () => {
    console.log("Application is now listening at http://127.0.0.1:3001");
});