const express = require('express');
const http = require('http');
const massive = require('massive');

const app = express();

function test(app) {
   app.get('/', (req,res) => res.send('Test anything displayed!'))
}

function part1_1users(app) {
   app.get('/users', (req, res) => {
        const queryString = 'select email, details from users order by created_at;';

        req.app.get('db').query(queryString).then(results => {
            let users = results.map((user) => {
                let email = user.email;
                let details = user.details;

                let sex = 'NA';
                if (details !== null){
                    let splitDetails = details.split(',');
                    sex = splitDetails[0].replace(/"/g, '').split('=>')[1];
                }
                return {email : email, sex:sex};
            });
            res.json(users);
        });
    });
}

function part1_2userbyid(app) {
  app.get('/users/:id', (req, res) => {
        const id = req.params.id;
        const queryString = 'select email, details from users where id = ${userId};'

        req.app.get('db').query(queryString, {userId: id}).then(results => {
            let users = results.map((user) => {
                let email = user.email;
                let details = user.details;

                let sex = 'NA';
                if (details !== null){
                    let splitDetails = details.split(',');
                    sex = splitDetails[0].replace(/"/g, '').split('=>')[1];
                }
                return {email : email, sex:sex};
            });
            res.json(users);
        });
    });
}

function part1_3products(app) {
   app.get('/products', (req, res) => {
        const queryString = 'select * from products order by price;';

        req.app.get('db').query(queryString).then(users => {
            res.json(users);
        });
    });
}

function part1_4productbyid(app) {
  app.get('/products/:id', (req, res) => {
        const id = req.params.id;
        const queryString = 'select * from products where id = ${productId};'

        req.app.get('db').query(queryString, {productId: id}).then(product => {
            res.json(product);
        });
    });
}

function part1_5purchases(app) {
   app.get('/purchases', (req, res) => {
        const queryString = 
        ' select name, address, users.email, purchase_items.price, purchase_items.quantity, purchase_items.state' 
        + ' from purchases '
        + ' inner join purchase_items on purchases.id = purchase_items.purchase_id '
        + ' inner join users on purchases.user_id = users.id '
        + ' order by purchase_items.price desc; ';

        req.app.get('db').query(queryString).then(purchases => {
            res.json(purchases);
        });
    });
}

function part2_sqlinject(app) {
  app.get('/products', (req, res) => {
        const name = req.query.name;
        // url = 
        // http://127.0.0.1:3000/products?name=a%27%3B+select+%2A+from+users+where+email+not+like+%27

        //will successfully show users data when it should be showing products

        const queryString = "select * from products where title = '" + name + "';";

        req.app.get('db').query(queryString).then(product => {
            res.json(product);
        });
    });
}

function part3_1parquery(app) {
  app.get('/products', (req, res) => {
        const name = req.query.name;
        // url = 
        // http://127.0.0.1:3000/products?name=a%27%3B+select+%2A+from+users+where+email+not+like+%27

        //will fail

        const queryString = "select * from products where title = ${productName};";

        req.app.get('db').query(queryString, {productName: name}).then(product => {
            res.json(product);
        });
    });
}

function part3_2storedprocedure(app) {
  app.get('/products', (req, res) => {
        const name = req.query.name;
        // url = 
        // http://127.0.0.1:3000/products?name=a%27%3B+select+%2A+from+users+where+email+not+like+%27

        //will fail

        const functionString = 
        " CREATE OR REPLACE FUNCTION showProductByTitle(productTitle VARCHAR) "
        + " RETURNS TABLE(id integer, title character varying(255), price numeric) "
        + " AS $$ "
        + " BEGIN "
        +   " RETURN QUERY "
        +     " select products.id, products.title, products.price "
        +     " from products "
        +     " where productTitle = products.title;"
        + " END; "
        + " $$ LANGUAGE plpgsql; "

        app.get('db').query(functionString);

        const queryString = "select * from showProductByTitle('Dictionary');";

        req.app.get('db').query(queryString).then(product => {
            res.json(product);
        });
    });
}

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'pgguide',
  user: 'Emmet',
  password: 'petrolbear'
}).then(instance => {
  app.set('db', instance);

  test(app);
  part1_1users(app);
  part1_2userbyid(app);
  part1_3products(app);
  part1_4productbyid(app);
  part1_5purchases(app);

  // part2_sqlinject(app);
  // part3_1parquery(app);
  // part3_2storedprocedure(app);

  http.createServer(app).listen(3000);
});
