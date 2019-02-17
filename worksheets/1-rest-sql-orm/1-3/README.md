this readme contains 2 pieces of information
* question 1 briefing
* screenshots for all routes

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

