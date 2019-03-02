const app = require('./dbConnection');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());
const crypto = require('crypto');

let validateSignature = (req, res, next) => {
  let access_key = req.headers['access_key']; //acces_key is passed in the request
  let signature = req.headers['signature'];//signature is passed in the request
  let param =  req.query.name;
  let message =  req.body.message;
  
  //get the user details of the given user id
  app.get('db').query(
        'SELECT * FROM users WHERE access_key= \'' + access_key + '\''
      ).then(user => {
        //If a user exits
        if( user[0] !=null){
            let secret = user[0]['secret_key'];//get the user's secret_key from the database
            const hmac = crypto.createHmac('sha256', secret);//create HMAC with the secret_key
              // //If a message is passed in the request of the body 
              if(message !== undefined){
                console.log("Message sent: "+ message);
                hmac.update(message);//Adding message to the hash signature (secret_key + message)
              }
              // //If a query parameter is passed in the request of the body 
              if(param !== undefined){
                console.log("Parameter sent: "+ param);
                hmac.update(param);//Adding message to the hash signature (secret_key + message)
              }
              const calculated_signature = hmac.digest('hex');//generate a valid signature
              // console.log("Computed signature: "+calculated_signature);
              //Compare the passed signature in the request with the calculated hash signature by the server
              if (signature === calculated_signature) {
                console.log('---------------------');
                console.log('Valid signature found');
                console.log('---------------------');
                next();//If they match we can proceed to display the protected resource to the user
              } else {
                console.log('---------------------');
                console.log('Signature not valid');
                console.log('---------------------');
                return res.json({
                  success: false,
                  message: 'Auth Denied: signature not valid'
                });
              }   
        }else{
          return res.json({
            success: false,
            message: 'access_key does not exits'
          });
        }
      });
  
};

module.exports = {
    validateSignature: validateSignature
}