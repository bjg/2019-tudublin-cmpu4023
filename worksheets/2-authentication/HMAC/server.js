const bodyParser = require('body-parser');
const port = 3001;
url = require("url");
const validate = require('./validateSignature');
const app = require('./dbConnection');
app.use(bodyParser.json());

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/products',validate.validateSignature,(request, response) => {
 app.get('db').products.find({}).then(p => response.json(p));
})
app.post('/products',validate.validateSignature,(request, response) => {
    app.get('db').products.find({}).then(p => response.json(p));
})

/*Steps for HMAC 
1. We need a public key and a private key for each user. The server knows already this information about every user.
2. On the client we need to create a signature made of the secret key and the message (if any).
3. The signature is encrypted using a hash function. eg.  SHA-256
4. The Client sends a request to the server in which the hashed signature and the public key is sent to the server. The private key is never exposed in teh request.
5. The Server finds the private key that corresponds to the user with the public key sent.
6. The Server calculates the same hash (seceret key + message). If this hash is the same as the signature sent in the request we know who was the sender.
*/

// CREATE TABLE users (    
//   id int NOT null,
//   name text NOT NULL,
//   password text NOT NULL,
//   access_key text ,
//   secret_key text 
// );

// 160 bits access key : 39d16617c4055a027a31e5993fd18fad2a7ffdfb
// 320 bits secret key : 2bb0c7df3e998ed86770b2ae9399a689d7d73e7184069d42c4ac3eb98b1d009645ade59ed6f295a6

// Update the new field of the users table with the keys
// UPDATE users
// SET access_key = '39d16617c4055a027a31e5993fd18fad2a7ffdfb', secret_key = '2bb0c7df3e998ed86770b2ae9399a689d7d73e7184069d42c4ac3eb98b1d009645ade59ed6f295a6'
// WHERE id = 1;