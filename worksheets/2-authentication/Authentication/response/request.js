/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 2
 *	Questions: All
 *	Type: Request"
 ***/

/* - Basic Auth */
const auth = require('basic-auth');

exports.authUser = (req) => { return auth(req); }

/* - HMAC Auth */
exports.clientHmac = (req) => {
	
	let token = req.headers.authorization.split(' ');
	let key = token[1].split('=');
	let signatureFromClient = token[2].split('=');

	return {"Key": key[1], "Signature": signatureFromClient[1]};
}
