'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    db = require('./config/db.js'),
    env = require('./config/env.js'),
    router = require('./router/index.js');

const app = express();
const PORT = env.PORT;

app.use(morgan('combined'));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
});

router(app, db);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log('Express listening on port:', PORT);
    });
});