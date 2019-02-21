const express = require('express');
const http = require('http');
const massive = require('massive');

const app = express();

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'devops'
}).then(instance => {
  app.set('pgguide', instance);

  app.get('/', (req, res) => {
    req.app.get('pgguide').query(
  'select * from users where id = $1',
  [5]
).then(user => { res.json(user);
  // all tests matching the criteria
});
  });

  http.createServer(app).listen(3000);
});