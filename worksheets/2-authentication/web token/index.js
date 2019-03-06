const express = require('express'),
	jwt = require('jsonwebtoken'),
	bodyParser = require('body-parser'),
	app = express(),
	crypto = require('crypto'),
	//For the purpose of demonstration the secret token key will be placed here
	secret = 'mydevioussecret'
const massive = require('massive');

app.use(bodyParser.json());


massive({
	host: 'localhost',
	port: 5432,
	database: 'postgres',
	user: 'daniel',
	password: 'brunomoloney'
}).then(instance => app.set("db", instance))
	
//Using postman application solved all the issues I was having with post (albeit it took a lot longer thanks to post issues! >:(  )

app.post('/register', async function (req, res) {
	//Storing variables for use
	const username = req.body.username;
	const password = req.body.password;

	//If the username or password have not been both passed in then give an error
	if (!username || !password) return  res.send('Please provide a user and password');
	
	//Using crypto to create keys
	//Part 3 implemented, 20 bytes for access key (160 bits) and 40 bytes for secret key (320 bits)
	const access_key = await crypto.randomBytes(20).toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
	const secret_key = await crypto.randomBytes(40).toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
	
	//Insert the information into db, creating new user
	await req.app.get('db').query("INSERT INTO users (access_key, secret_key, username, password) " +
	"VALUES ('" + access_key + "', '" + secret_key + "', '" + username + "', crypt('" + password + "', gen_salt('bf', 8)));")
	
	res.send('Successfully registered')
})

//Login for user (creates the web token)
app.post('/login', async function(req, res) {
	//Variables for passed parameters
	const username = req.body.username;
	const password = req.body.password;

	//If username, password not inputted then give error
	if (!username || !password) return res.send('Please provide a user and password');

	//Check if user exists
	const result = await req.app.get('db').query("SELECT access_key, secret_key, password = crypt('" + password + "', password) " +
		"FROM users WHERE username='" + username + "';")

	if (!result[0]) return  res.send('invalid login');
	
	//Create the token using secret at top of js file and username, expires in 1 hour
	var token = jwt.sign({username: username,}, secret, { expiresIn: '1h' });

	//Return the successes and the access key and secret key of that user
	res.status(200).send({
		success: true,
		message: 'Token created',
		token: token,
		//The result of result, which succeeded, is parsed for the access key and secret key which is then printed.
		access_key: result[0].access_key,
		secret_key: result[0].secret_key
	})
}) 

//Post for creating signature for hmac functionality
app.post('/login/getsignature', async function(req, res) {
	const username = req.body.username;
	const password = req.body.password;
	
	if (!username || !password) return res.send('Please provide a user and password');

	//Check if user exists
	const result = await req.app.get('db').query("SELECT access_key, secret_key, password = crypt('" + password + "', password) " +
		"FROM users WHERE username='" + username + "';")

	if (!result[0]) return  res.send('invalid login');
	
	//Create signature for user with secret key and with products table name "q tips"
	var signature = crypto.createHmac('sha256', "WdLws653EKk7b_C0dKZbXEdnL9WSYBBPWVhbT4uSkqsZxt8cbwanbA==").update("q tips").digest('hex')

	//print signature
	console.log(signature)

	//Output to console
	res.status(200).send({
		success: true,
		message: 'Signature generated',
		signature: signature,
	})
})

//Getting the product requested if token exists for user
app.get('/products/jwt',async  (req, res) => {
	const name = req.body.name;
	const token = req.headers.token;
	//if no token passed in header give error
	if (!token) return res.status(401).send("No token provided")

	//If token is incorrect then give error, otherwise return the info requested
	jwt.verify(token, secret, async (err, decoded) => {
		if (err) return res.status(401).send(err)
		if (!decoded) return res.status(401).send("Invalid token")
		res.status(200).send(await req.app.get("db").query("select * from products where name= '" + name + "'"))
	})
})

//Hmac app using the signature genereated previously
app.get('/products/hmac', async (req, res) => {
	//If not passed in then give error
	if (!req.headers.signature) return res.status(401).send("No signature provided")
	if (!req.headers.access_key) return res.status(401).send("No access key provided")

	//get the secret key using the access key passed in for reference
	const result = await req.app.get('db').query("select secret_key from users WHERE access_key='" + req.headers.access_key+ "'")
	if  (result.length === 0) return res.status(401).send("Invalid access key")

	//If user is valid then create a hmac and compare it to the previously created one for that user and product name, if matches other signature generated then post the value from products table where name = q tips
	if (req.headers.signature === crypto.createHmac('sha256', result[0].secret_key).update(req.body.name).digest('hex')){
		res.status(200).send(await req.app.get("db").query("select * from products where name= '" + req.body.name + "'"))

	}else res.status(401).send("Unauthenticated")
})

//Listen for requests
app.listen(3000, () => {
    console.log('listening on port 3000!')
}) 