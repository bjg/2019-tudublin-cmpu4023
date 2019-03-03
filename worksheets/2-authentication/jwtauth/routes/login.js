const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken");

const username = "lauren@google.com"
const password = "password"

router.post('/',(req, res, next) => {
	
	let p_username = req.body.username
	let p_password = req.body.password
	
	if(p_username == username && p_password == password){
		var token = jwt.sign({
			exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
			email:username
		},'secret',
		(err, token) => {
			res.send({
				ok: true,
				message: "Login successful",
				token: token
			})
		})
	} else {
		res.send({
			ok: false,
			message: "Username or password incorrect"
		})
	}	
})
module.exports = router;