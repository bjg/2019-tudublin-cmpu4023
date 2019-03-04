const express = require('express');
const massive = require('massive');
const bodyparser = require('body-parser');
const http = require('http');
const app = express();
const port = 3000;
var instance;
//var crypto = require('crypto');

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'doudou89979'
}).then(instance => {
  app.set('db', instance);
 
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true})); 
  
app.get('/users', (req, res) => {
	  req.app.get('db').users.insert({
	   'username': "Tom Jeyyy",
	   'password': "123456" 
    }).then(users => {res.send(users);
	});
 });
 
  
app.post('/cryptup', (req, res) => {
	   var username = req.body.username;
	   var password = req.body.password;
	   req.app.get('db').procedure_title(username,password).then(users => {res.send({
            message: 'Registered Successfully',
            resultCode: 202
            });
	});
 });
   
 app.get('/cryptin', (req, res) => {
	   var username = req.query.username;
	   var password = req.query.password;
	   req.app.get('db').cyrpyin(username,password).then(users => {res.send({
            message: 'Login Successfully',
            resultCode: 202
            });
	});
 });
 app.get('/listuser', (req, res) => {
	  req.app.get('db').query('select * from users').then(users => {res.send(users);
	});
 });
  
//57--88 T4  
app.post('/hmac/signup', (req, res) => {
	   var user_name = req.body.username;
	   var pass_word = req.body.password;
	   var access_key = req.body.accesskey;
	   res.app.get('db').hmac_p_up(user_name,pass_word,access_key).then(users => {res.send({
            message: 'Registered Successfully',
            resultCode: 202
            });
	});
 });


 
 app.post('/hmac/signin', (req, res) => {
	   var user_name = req.body.username;
	   var pass_word = req.body.password;
	   var access_key = req.body.accesskey;
	  if(!user_name||!pass_word){
        res.status='404';
        res.send({
            message: 'Wrong Password',
            resultCode: 1
            })
        return;
      }
    req.app.get('db').hmac_p_in(user_name,pass_word,access_key).then(users => {res.send(users);
    }).then(users => {res.send({
            message: 'Login Successfully',
            resultCode: 202
            });
	});
 });
  

  
  http.createServer(app).listen(3000);
});