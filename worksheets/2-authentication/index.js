const express = require('express');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const crypto = require('crypto');
const app = express();


var sequelize = new Sequelize('postgres', 'postgres', 'doyler1995', {
  host: 'localhost',
  dialect: 'postgres',
  schema: 'lab2',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },


});


const port = 3000

sequelize.authenticate().then(() =>
  {
    console.log('SUCCESS')
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
  })
  .catch(error =>
  {
    console.error('ERROR:', error)
  });

var users = sequelize.define('users',
{
 username:
 {
   type: Sequelize.INTEGER,
   primaryKey: true,
   autoIncrement: true
 },
 password:
 {
   type: Sequelize.STRING
 },
 },{
 timestamps: false,
});

app.get('/api/users', function(request, response)
{
   users.findAll().then(get_info => {
   response.send(get_info);
 })
});

app.post('/api/login', (request,response)=>
{
  let username = "Chloe_Doyle"
  let password = "password"

//sequelize.query("SELECT * FROM lab2.users WHERE username = 'Chloe_Doyle' AND password= lab2.crypt('password', password);")
sequelize.query("SELECT * FROM lab2.users WHERE username = '"+ username + "' AND password= lab2.crypt('" +password +"', password);")
.then(items =>
          {
            if(items[1].rowCount != 0)
            {
              let username = items[0].username;
              let password = items[0].password;
              const user =
            {
              username,
              password
            }
              jwt.sign({user:user}, 'verysecretkey', {expiresIn: '24h'},(error,token)=>
              {
                response.json(
                {
                  token
                });
              });
            } else{response.json('fail');}
          })
          .catch(error => console.log(error));
  });


  app.post('/api/posts', verifyToken, (request, response)=>
  {
    jwt.verify(request.token, 'verysecretkey', (error, Auth_Data)=>
    {
        if(error)
        {
          response.sendStatus(403);
        }
        else
          {
            sequelize.query("SELECT * FROM lab2.products")
            .then(products =>
            {
              response.json
              ({
                products,
                Auth_Data})
            })

        }
    });

  });

    app.get('/api/hmac', (request,response) =>
    {
      clients_signature = request.headers['x-signature'];
      const secret = 'verysecretkey';
      servers_signature = crypto.createHmac("sha256", secret).digest("hex");

      if(clients_signature === servers_signature)
      {
        response.sendStatus(200);
        console.log("SUCCESS");
      }
      else
      {
        response.sendStatus(403);
        console.log("FAIL");
      }
    })


//authorization:Bearer <token_given>
function verifyToken(request, response, next)
{
  const bearerHeader = request.headers['authorization'];
  if (typeof bearerHeader !== 'undefined')
  {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    request.token = bearerToken;
    next();
  }
  else
  {
    response.sendStatus(403);
  }
}
