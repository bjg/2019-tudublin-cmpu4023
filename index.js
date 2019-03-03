const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const router = require('./router');
const promise = require('bluebird')
const crypto = require('crypto')
const registerCtrl= require('./controllers/auth');
const authService = require('./services/auth');
const userService = require('./services/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     extended: true
}));
app.use(express.static('client'));
router.set(app);

app.put('/hmac', (req,res,next) =>{
     const authHeaderHash = req.headers.authorization
     
     const signature = req.body.accesskey + req.body.message
 
     const hmac = crypto.createHmac('sha256','demosecretkey')
 
     hmac.update(signature)
 
     const serverHash = hmac.digest('hex')
     console.log(serverHash)

     if(authHeaderHash == serverHash){
          return res.status(200).send({ auth: true, message: 'Hashes are the same.' });
     }
     if (authHeaderHash != serverHash )
     return res.status(400).send({ auth: false, message: 'Hashes are not the same' });
 })

app.listen(config.port, () => console.log('App listening on port '+ config.port));