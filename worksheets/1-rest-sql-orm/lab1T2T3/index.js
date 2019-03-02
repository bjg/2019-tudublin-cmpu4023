const express = require('express');
const massive = require('massive');
const http = require('http');
const monitor = require('pg-monitor');
const app = express();
const port = 3000;
var instance;

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'doudou89979'
}).then(instance => {
  app.set('db', instance);
 
//SQL inject  
  app.get('/products', (req, res) => {	
    var titlename = req.query.titlename 
	if (titlename == null){
	   req.app.get('db').query('select * from products').then(items => {
           res.json(items);
         });
	}
   	 else{
	   req.app.get('db').query('select * from products WHERE title = \'' + titlename + '\'').then(items => {
           res.json(items);
       });
	 }
  });
  
  // use parameterised
   app.get('/api/products', (req, res) => {	
    var titlename = req.query.titlename 
	if (titlename == null){
	   req.app.get('db').query('select * from products').then(items => {
           res.json(items);
         });
	}
   	 else{
	   req.app.get('db').query('select * from products WHERE title = ${title}',{
	    title: titlename
	  }).then(items => {
           res.json(items);
       });
	 }
  });
  
  
  //use StoredProsedure
  /* create function  procedure_title(titlename varchar(20))
   return setof products
   language sql
   as $$ 
   SELECT *  FROM products where title = titlename 
   $$;
 */ 
  
   app.get('/api/StoredProcedure', (req, res) => {	
    var titlename = req.query.titlename 
	if (titlename == null){
	   req.app.get('db').query('select * from products').then(items => {
           res.json(items);
         });
	}
   	 else{
	    req.app.get('db').query("select * from procedure_title('Python Book').then(items => {
	      res.json(items);		  
       });
	 }
  });
 
  http.createServer(app).listen(3000);  
});


