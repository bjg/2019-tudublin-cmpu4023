const express = require('express')
const app = express()
const port = 3000

const massive = require('massive');

const db = massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'ycc',
  password: 'toor1234',
  ssl: false,
  poolSize: 10
}).then(instance => console.log(instance.listTables()));

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

console.log(db.listTables())