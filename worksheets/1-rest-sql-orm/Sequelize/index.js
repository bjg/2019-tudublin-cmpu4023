const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const db = require('./config/database')

// Initialize express app
const app = express();

// Support json encoded bodies
app.use(bodyParser.json());

// Support encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

// Load the pug View
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Start the app
app.listen('3000', function(){
    console.log('server started on port 3000...');
});

// Tests the DB connection is successful
db.authenticate()
    .then(() => console.log("Database connection established....."))
    .catch(err => console.log("Database connection error: " + err));

// Home Url Route
app.get('/', function(req, res){
    res.render('index', {
        title:'Home Page'
    });
});

// App routes
app.use('/api', require('./routes/app'));

// Add tests data route
app.use('/addtest', require('./routes/test_data'));

