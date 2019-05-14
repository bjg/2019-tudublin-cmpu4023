# Contents
This readme contains 2 pieces of information
* question 1 briefing
* screenshots for all routes from question 1 to 3

## Question 1: "briefly show how you did this"

### How i used express to map certain url's e.g. /users

After firstly calling the method express from the required express package I was able to retrieve the return value from the function
and make routes from it e.g.

```
const express = require('express');
const app = express();
```

The returned app value was then used to listen out to all routes on the port value e.g.

```
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
});
```

From their I tested out the routes to see if they were working e.g.

```
app.get('/test', (req, res) => {
    res.status(200).send("test");
});
```

###  How I used sequelize to get a certain tables data

After vertifying the connection to the database with the code ...

```
const Massive = require("massive");

module.exports =  Massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide',
    user: 'pgguide_user',
    password: '123',
    ssl: false,
    poolSize: 10
});


```

... it was possible to get data from a specific table by using the "find" method provided by sequelize e.g.

```
    massive.then(db => {
        db.users.find({},{
            fields: ['email', 'details'],
            order: [{
                field: 'created_at',
                direction: 'desc',
            }]
        })
        .then(allUsers => res.status(200).send(allUsers))
```

where 
* "massive" is the value returned by the database connection. 
* "db" is the connection to the database returned by the promise massive resolves to
      
In this example the user table is queried for its email and details

Getting data for a particular id was achieved by providing a "/:id" at the end of the url and then retrieving the id
value with the syntax req.params.id. The id was then searched for e.g.

```
app.get('/products/:id', (req, res) => {
    massive.then(db => {
        db.products.find({id: req.params.id})
        .then(product => product.length == 0 ? res.status(204).send(product): res.status(200).send(product))
        .catch(err => res.status(403).send(err));
    }).catch(err => res.status(403).send(err));
});
```

## Screenshots for all the routes

### /users

<img width="947" alt="users" src="https://user-images.githubusercontent.com/23337553/52916507-48f74480-32d8-11e9-9875-bd472566ab71.png">

### /users/:id

<img width="960" alt="users-id" src="https://user-images.githubusercontent.com/23337553/52916511-557b9d00-32d8-11e9-9393-138bacc9a80d.png">

### /products

<img width="939" alt="products" src="https://user-images.githubusercontent.com/23337553/52916515-60363200-32d8-11e9-929c-dd6a884f23fd.png">

### /products/:id

<img width="948" alt="products-id" src="https://user-images.githubusercontent.com/23337553/52916517-6d532100-32d8-11e9-8bc6-edcbbba0927e.png">

### /products_parameterised

<img width="943" alt="products_parameterised" src="https://user-images.githubusercontent.com/23337553/52916523-80fe8780-32d8-11e9-9986-a89fb1e8da09.png">

### /products_stored

<img width="946" alt="products_stored" src="https://user-images.githubusercontent.com/23337553/52916526-91aefd80-32d8-11e9-81ef-0be176f933f5.png">

### /purchases

<img width="940" alt="purchases" src="https://user-images.githubusercontent.com/23337553/52916531-9d9abf80-32d8-11e9-8049-c2e6288e2a7a.png">





