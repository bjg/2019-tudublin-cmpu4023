/////////////// imports //////////////////////////
const express = require('express') // import node module - express
const path = require("path"); // used for templates
const indexRouter = require('./routes/api');
const hoganMiddleware = require('hogan-middleware');

////////////// APP stuff //////////////////////////
const app = express() // creating an express object
const port = 3000 //setting the port number to listen on

////////////// middleware /////////////////////////
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.engine('mustache', hoganMiddleware.__express);

////////////// static assets ///////////////////////
app.use(express.static(path.join(__dirname, 'public'))); //setting static assets

////////////// Router ////////////////////
app.use('/', indexRouter);


//////////////// listener /////////////////////////////
app.listen(port, () => console.log(`EAD Lab2 - Authentication -  app listening on port ${port}!`))