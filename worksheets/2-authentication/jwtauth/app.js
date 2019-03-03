const createError = require('http-errors');
const express = require('express');
const massive = require('massive');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const crypto = require('crypto');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const hmacRouter = require('./routes/hmac');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/hmac', hmacRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/* Connect Massive to DB */
massive({
    host: 'localhost',
    port: 5432,
    database: 'pgauth',
    user: 'postgres',
    password: '28101997'
}).then(db => { 
    app.set('db', db);
});

app.listen( 3000, function() {
  console.log( 'Server listening on port 3000' ) ;
} ) ;

module.exports = app;
