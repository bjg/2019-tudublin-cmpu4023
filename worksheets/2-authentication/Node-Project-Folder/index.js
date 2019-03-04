const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const bodyParser = require('body-parser')
let urlencodedParser = bodyParser.urlencoded({ extended: false});

const Sequelize = require('sequelize');
const sequelize = new Sequelize('Lab2Authentication', 'Patrick', 'Authentication', {
	host: 'localhost',
	dialect: 'postgres',
	define: {
        timestamps: false
    },
	operatorsAliases: false,

	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

//Creating models
const User = sequelize.define('user', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
        autoIncrement: true
	},
	username: {
		type: Sequelize.STRING
	},
	password: {
		type: Sequelize.STRING
	}
});

const Helper = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  },
  /**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(id) {
    const token = jwt.sign({
      id: id
    },
      process.env.SECRET, { expiresIn: '7d' }
    );
    return token;
  }
}

const Auth = {
  /**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object 
   */
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if(!token) {
      return res.status(400).send({ 'message': 'Token is not provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(text, [decoded.userId]);
      if(!rows[0]) {
        return res.status(400).send({ 'message': 'The token you provided is invalid' });
      }
      req.user = { id: decoded.userId };
      next();
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

// Base Route, and further routing instructions
app.get('/', (req, res) => res.send('RESTful API - Express, Sequelize & JWT<br>\
	GET /add_users - Create a new user form <br>\
	POST /add_users - Create a user<br>\
  GET /login - Get login page <br>\
	POST /login - Login and authenticate user <br>\
	'
));

// Add User
app.get('/add_users', (req, res) => {
	res.sendFile(path.join(__dirname+'/add_users.html'));
});


app.post('/add_users', urlencodedParser, (req, res) => {
  const hashPassword = Helper.hashPassword(req.body.password);
	User.build({
			username: req.body.username,
			password: hashPassword
		}).save().then(user => {
			console.log("User: " + user + " added.");
		})
		  .catch(error => {
			console.log(error);
		});

    res.redirect('/add_users')
});

// Login
app.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname+'/login.html'));
});


app.post('/login', urlencodedParser, (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({'message': 'Some values are missing'});
  }
  const text = 'SELECT * FROM users WHERE username = $1';
  //try {
    const { rows } = sequelize.findAll({where: {username: req.body.username}});
    if (!rows[0]) {
      return res.status(400).send({'message': 'The credentials you provided is incorrect'});
    }
    if(!Helper.comparePassword(rows[0].password, req.body.password)) {
      return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
    }
    const token = Helper.generateToken(rows[0].id);
    return res.status(200).send({ token });
  //} catch(error) {
  //  return res.status(400).send(error)
  //}
});

// Add product
app.get('/add_products', (req, res) => {
	res.sendFile(path.join(__dirname+'/add_products.html'));
});


app.post('/add_products', urlencodedParser, (req, res) => {
	Product.build({
			title: req.body.title,
			price: parseFloat(req.body.price),
		}).save().then(product => {
			console.log("Product: " + product + " added.");
		})
		  .catch(error => {
			console.log(error);
		});
	res.redirect('/products?name=' + title)
});
