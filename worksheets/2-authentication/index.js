const express = require('express');
const massive = require('massive');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// PARSERS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ROUTES
app.use("/", require("./routes/index"));
app.use("/login", require("./routes/login"));
app.use("/hmac", require("./routes/hmac"));


/*
    use create.sql to setup the db and insert a user with the email [doop@doop.com] and password [password]

    TO VERIFY ROUTE NEEDS KEY:
    curl -X GET \
      http://localhost:3000/ \
      -H 'cache-control: no-cache'

    TO LOGIN:
        curl -X POST \
          http://localhost:3000/login/ \
          -H 'Content-Type: application/x-www-form-urlencoded' \
          -H 'cache-control: no-cache' \
          -d 'email=doop%40doop.com&password=password'

    TO VERIFY KEY WORKS:
    curl -X GET \
      http://localhost:3000/ \
      -H 'Authorization: Bearer [KEY GENERATED FROM PREVIOUS REQUEST' \
      -H 'Content-Type: application/x-www-form-urlencoded' \
      -H 'cache-control: no-cache'

 */

massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'authentication',
    user: 'Daniel',
    password: 'password'
}).then(db => {
    app.set('db', db);

    app.listen(3000, () => console.log(`Example app listening on port 3000!`));
});