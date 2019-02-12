const express = require("express");
const massive = require("massive");
const app = express();

//connect to massive
massive({
    host:"127.0.0.1",
    port:5432,
    database:"pgguide",
    user:"postgres",
    password:"mitkodi123",
    ssl: false,
    poolSize: 10
}).then(instance => {
    app.set('db',instance);

    app.get("/",(req,res) => {
        res.send ("Hello World");
        console.log("List of Tables \n" + instance.listTables());
    });


    /* Par 1*/
    app.get("/users",(req,res) =>{
        instance.query("select email,details from users")
            .then((users) =>{
                res.send(users);
            })
    });

    app.get("/users/:id",(req,res) =>{
        const userid = req.params.id;
        instance.query(`select * from users where id = ${userid}`)
            .then(user=>{
                res.send(user);
            })
    });

    app.get("/products",(req,res) =>{
        if(Object.keys(req.query).length ===0) {
            /*part 1 solution*/
            instance.query("select * from products")
            .then(products => {
                res.send(products);
            })
        }else{
            /*Part 2
            * This function is vulnerable to SQL injections atm
            * A delete query will not work because of foreign key constraints, however
            * An attacker can set the prices to products at 0 using an update query by typing in the following
            * http://127.0.0.1:3000/products?name=Dictionary'; update products set price = 0 where id =1; -- */
            const pName = req.query.name;
            console.log(pName);
            instance.query(`select * from products where title = '${pName}'`)
            .then(product =>{
                res.send(product);
            })
        }
    });

    app.get("/products/:id",(req,res) =>{
        const productId = req.params.id;
        instance.query(`select * from products where id = ${productId}`)
            .then(product =>{
                res.send(product);
            })
    });

    app.get("/purchases",(req,res) =>{
        instance.query("select p.purchase_id, p.price, p.quantity, p.state, ps.name, ps.address, u.email from purchase_items p " +
            "inner join purchases ps on p.purchase_id = ps.id " +
            "inner join users u on ps.user_id = u.id " +
            "order by p.price DESC"
        )
        .then(record =>{
            res.send(record)
        })
        .catch(error => {console.log(error)});
    });

    /*Part 3 secured queries*/

    /*Parameterised query*/
    app.get('/products-parameterised',(req,res)=>{
        if(Object.keys(req.query).length !== 0){

        }
    });

    /*Store procedure query*/
    app.get('/products-stored-procedure',(req,res)=>{
        if(Object.keys(req.query).length !==0){

        }else{
            res.send("empty query string");
        }
    });

    app.listen(3000,()=>{
        console.log("Application is now runnig on http://127.0.0.1:3000");
    });

});



