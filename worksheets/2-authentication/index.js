// Required modules and object constructors
const express = require('express')
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const crypto = require("crypto")
const CryptoJS = require("crypto-js")
const SHA256 = require("crypto-js/sha256");

const jwa = require("jwa");
const hmac = jwa("HS256");

const saltRounds = 10
const app = express()
/**
 * Sequelize Constructor Object
 *
 * @property {(function|function[])} host: The host of the relational database.
 * @property {(function|function[])} dialect: The dialect of the database you are connecting to. One of mysql, postgres, sqlite and mssql.
 * @property {(function|function[])} operatorsAliases: Posgress database name
 * @property {(function|function[])} pool: Posgress server username
 */
const sequelize = new Sequelize('postgres', 'postgres', 'supersafepassword', {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,
    schema: 'lab2',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

// Constant variables called throughout the programe
const port = 3000
const privatekey = fs.readFileSync('keys/private.key','utf8')
const publickey = fs.readFileSync('keys/public.key','utf8')

/**
 * Test the connection by trying to authenticate the connection
 * 
 * @returns {Promise} No returned objects
 */
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

/**
 * Question 1 - User table with hashed password using Sequelize crypt and gen_salt
 * Question 3 - Extende user Table with two new columns, accessKey & secreteKey
 * Define a new model, representing a table in the DB.
 * @param {string} 'users' - Name of the Table
 * @param {Object} attributes - Each attribute is a column in the table
 * @param {Object} options 
 * @description Specifies users Table.
 * 
 * @property {attribute} id: ID of the User, Primary Key, and auto increment
 * @property {attribute} username: Username of the User, validated
 * @property {attribute} password: Password of the User
 * @property {attribute} created_at: Auto timestamp upon creation
 * @property {attribute} deleted_at: Timestamp at deletion
 */
const Users = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    hashed_password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    accessKey: {
    	type: Sequelize.CHAR(160)
    },
    secreteKey: {
    	type: Sequelize.CHAR(320)
    }
}, {
    timestamps: false
})


/**
 * Define a new model, representing a table in the DB.
 * @param {string} 'product' - Name of the Table
 * @param {Object} attributes - Each attribute is a column in the table
 * @param {Object} options 
 * @description Specifies product Table.
 * 
 * @property {attribute} id: ID of the Product, Primary Key, and auto increment
 * @property {attribute} title: Title of the Product
 * @property {attribute} price: Price of the Product
 * @property {attribute} created_at: Auto timestamp upon creation
 * @property {attribute} deleted_at: Timestamp at deletion
 * @property {attribute} tags: SEO product tags
 */
const Products = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: Sequelize.FLOAT(10),
        validate: {
            isFloat: true,
            min: 0.0
        }
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: sequelize.fn('NOW')
    },
    deleted_at: {
        type: Sequelize.DATE,
        defaultValue: null
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
    }
}, {
    timestamps: false
})

/** /POST Route
 * Pass the defined route and results to a callback function.
 * localhost:3000/authenticate/hmac?userame=Ciaran&password=password
 * This route is concerned with signing up a user, by simply adding them to the database
 *
 * @function post
 * @param {string} - '/signup'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */
 /** Sequlize.query()
 *
 * @param {String} - SQL parameterised string query
 * @attribute username {String} - The title of a new product 
 * @attribute hashed_password {String} - The price of a new product
 * @attribute accessKey {String} - Hmac key using jwa("HS256").sign()
 * @attribute secreteKey {String} - Random secrete key using Crypto.
 */

let createUSERSQL = "INSERT INTO lab2.users VALUES (:username::text,lab2.crypt(:hashed_password::text,lab2.gen_salt('md5'::text)),:accessKey::text,:secreteKey::text)"
app.post('/signup',function(req,res) {
	password = req.query.password
	sequelize.query(createUSERSQL, { 
		replacements:{
			username:req.query.username, 
			hashed_password:password,
			accessKey: hmac.sign(req.query.username,password),
			secreteKey: crypto.randomBytes(50)
		}, 
		type: sequelize.QueryTypes.INSERT 
	})
	.then(success => res.send("Success"))
	.catch(err => console.log(err))	
})

/** /POST Route
 * Pass the defined route and results to a callback function.
 * localhost:3000/authenticate/hmac?userame=Ciaran&password=password
 * This route is concerned with JWT authentication 
 *
 * @function post
 * @param {string} - '/authentication'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

 /** Users.findOne(){Promise}
 * Access the defined sequelize model 
 * 
 * @promise findOne
 * @property username {String} - Passed username of the user
 * @property hashed_password {String} - hashed password using Postgres crypt()
 * @resolve {Object} - Upon a successful sql query, all values from the row are returned
 * @reject {Object} - Error object is send to the client
 */

 /** Promise.then() function
 * 
 * Upon a promise resolution, we check if the returned object 'result' is not null.
 * If it fails, we create a JWT signature using the username and secrete key
 * and return our reponse object.
 * If it successed, we continue
 * @param {Object} - Revolved Promise object containing sql query result data
 * @returns {Object} - response object
 */
let sqlQ = "SELECT username,hashed_password FROM lab2.users WHERE username = :username AND hashed_password = lab2.crypt(:hashed_password,hashed_password)"
app.post('/authentication', function(req, res) {
	//sequelize.query(sqlQ, {replacements:{username:req.query.username, hashed_password:req.query.hashed_password},type: sequelize.QueryTypes.SELECT})
  
  Users.findOne({where: {
    username: req.query.username,
    hashed_password: sequelize.fn('lab2.crypt',req.query.hashed_password,sequelize.col('hashed_password'))
  }})
  .then(function(result) {
    if(result) {
      var result = {
        valid: true,
        token: jwt.sign({
          username: result.username
        }, privatekey, { expiresIn: 60 * 60, algorithm: "RS256"}
        )
      }
      return res.json(result);
    }
    return res.json({
      valid: false,
      message: "failed to authenticate user"
    })
  }).catch(err => {
 	 console.log(err)
	})
})

/** /POST Route
 * Pass the defined route and results to a callback function.
 * localhost:3000/authenticate/hmac?userame=Ciaran&password=password
 *
 * @function post
 * @param {string} - '/product'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

 /** Users.findOne(){Promise}
 * Access the defined sequelize model 
 * 
 * @promise findOne
 * @property username {String} - Passed username of the user
 * @property hashed_password {String} - hashed password using Postgres crypt()
 * @resolve {Object} - Upon a successful sql query, all values from the row are returned
 * @reject {Object} - Error object is send to the client
 */

 /** Promise.then() function
 * 
 * Upon a promise resolution, we call @link{verify(keyToVerify,method)}.
 * If it fails, we return our reponse object.
 * If it successed, we continue
 * @param {Object} - Revolved Promise object containing sql query result data
 * @returns {Object} - response object
 */

 /** Sequlize.query()
 *
 * @param {String} - SQL parameterised string query
 * @attribute title {String} - The title of a new product 
 * @attribute price {float} - The price of a new product
 * @attribute tags {Array} - The set of tags of a new product
 */

 /** Promise.then() 
 * 
 * Upon a promise resolution, 
 * @param success {Object} - Revolved Promise object containing reponse object data
 * @returns {Object} - response object
 */
app.post('/product', function(req,res){

	const BearerToken = req.headers['authorization'].match('(?<=Bearer ).*$')[0]
	
	if(!verify(BearerToken,"jwt")){
		return res.status('401').send({
			valid:false,
			message: "invalid user token!"
		})
	} 
	req.token = verify(BearerToken,"jwt")
	sequelize.query("INSERT INTO lab2.products (title, price,tags) VALUES (:title::text,:price::float(10),:tags::text[])", 
		{ 
			replacements:{
				title: req.query.title, 
				price: parseFloat(req.query.price).toFixed(2), 
				tags: req.query.tags
			}, 
			type: sequelize.QueryTypes.INSERT
		})
	.then(success => res.status('200').send({
		valid:true,
		message: "Valid User Token. Product posted"
	}))
	.catch(err => console.log(err))
})

app.post('/setup/hmac', function(req,res){
	const signature = hmac.sign(req.query.message
);
})

/** /POST Route
 * Pass the defined route and results to a callback function.
 * localhost:3000/authenticate/hmac?userame=Ciaran&password=password
 *
 * @function post
 * @param {string} - '/authenticate/hmac'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

 /** Users.findOne(){Promise}
 * Access the defined sequelize model 
 * 
 * @promise findOne
 * @property username {String} - Passed username of the user
 * @property hashed_password {String} - hashed password using Postgres crypt()
 * @resolve {Object} - Upon a successful sql query, all values from the row are returned
 * @reject {Object} - Error object is send to the client
 */

 /** Promise.then() function
 * 
 * Upon a promise resolution, we check if the returned object 'result' is not null.
 * If it fails, we create a Hmac signature using the username and hashed password 
 * and return our reponse object.
 * If it successed, we continue
 * @param {Object} - Revolved Promise object containing sql query result data
 * @returns {Object} - response object
 */
app.post('/authenticate/hmac', function(req,res){
	Users.findOne({where: {
    username: req.query.username,
    hashed_password: sequelize.fn('lab2.crypt',req.query.hashed_password,sequelize.col('hashed_password'))
  }})
	.then(function(result) {
    if(result) {
    const signature = hmac.sign(result.username, result.hashed_password)
      return res.json({
      	valid: true,
      	message:{
      		signature: signature
      	}
      });
    }
    return res.json({
      valid: false,
      message: "failed to authenticate user"
    })
  })
	.catch(err => console.log(err))
})

/** /PUT Route
 * Pass the defined route and results to a callback function.
 * localhost:3000/hmac/product?title=New Product&price=9.9&tags=["foo","bar"]&userame=Ciaran&password=password
 * This route is concerned with Hmac authentication
 * 
 * @function post
 * @param {string} - '/hmac/product'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

 /**
 * Access the defined sequelize model and create a new row
 * 
 * @promise findOne
 * @property username {String} - Passed username of the user
 * @property hashed_password {String} - hashed password using Postgres crypt()
 * @resolve {Object} - Upon a successful sql query, all values from the row are returned
 * @reject {Object} - Error object is send to the client
 */

 /** Promise.then() function
 * 
 * Upon a promise resolution, we call @link{verify(keyToVerify,method)}.
 * If it fails, we return our reponse object.
 * If it successed, we continue
 * @param {Object} - Revolved Promise object containing sql query result data
 * @returns {Object} - response object
 */

 /** Sequlize.query()
 *
 * @param {String} - SQL parameterised string query
 * @attribute title {String} - The title of a new product 
 * @attribute price {float} - The price of a new product
 * @attribute tags {Array} - The set of tags of a new product
 */

 /** Promise.then() 
 * 
 * Upon a promise resolution, 
 * @param success {Object} - Revolved Promise object containing reponse object data
 * @returns {Object} - response object
 */
app.put('/hmac/product', function(req,res){
	const signature = req.query.signature
	const userHmac = req.query.userHmac
	Users.findOne({where: {
    username: req.query.username,
    hashed_password: sequelize.fn('lab2.crypt',req.query.password,sequelize.col('hashed_password'))
  }})
	.then(function(result){
		if(!verify([result.username,req.query.signature,result.hashed_password],"hmac")){
		return res.status('401').send({
			valid:false,
			message: "invalid user token!"
		})
	} 
	sequelize.query("INSERT INTO lab2.products (title, price,tags) VALUES (:title::text,:price::float(10),:tags::text[])", 
		{ 
			replacements:{
				title: req.query.title, 
				price: parseFloat(req.query.price).toFixed(2), 
				tags: req.query.tags
			}, 
			type: sequelize.QueryTypes.INSERT
		})
	.then(success => res.status('200').send({
		valid:true,
		message: {
			Message_Body: "successfully posted new product",
			accessKey:success,
			queryParams:req.query
		}
	}))
	.catch(err => console.log(err))
	})
	
})

/** 
 * Function to veirfy is the token/key that is passed can be verified according to the token method
 * In this lab, we implemented two authentication  methods 'JWT' and 'Hmac'
 * Each different method requires a differet verification method, but both return true/false 
 *
 * @param keyToVerify {Object} - Key Object containing from 1 to 3 verification keys
 * @param method {String} - Method check used by the switch stament 
 * @returns token{boolean} - Return true is verification method is true
 * Returns false is the verification method has failed
*/
function verify(keyToVerify,method){
	let token
	switch(String(method)){
	case 'jwt':
			token = jwt.verify(keyToVerify,publickey,{algorithm: ["RS256"]}) 
			break;
	case 'hmac':
			token = hmac.verify(keyToVerify[0],keyToVerify[1],keyToVerify[2])
			break;
	default:
		console.log("default")
		return false
	}
	return token
}

/**
 * Sync all User model data to postgress server
 */
Users.sequelize.sync()
	.then(() => Users.destroy({
		where: {}
  }))

/**
 * Sync all User model data to postgress server
 */
Products.sequelize.sync()
	.then(() => Products.destroy({
		where: {}
  }))