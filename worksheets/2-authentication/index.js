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