var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var keygen = require("generate-key");
var models = require('./models')();
var secret = "$329239dksdkdjkw" 
var express = require("express");
var app = express();
var massive = require("massive");
var auth = {}

module.exports = auth;

massive(connectionString).then(massiveInstance => {
    app.set('db', massiveInstance);
    http.createServer(app).listen(3000);

var response = (status, message, data=undefined) => {
  return { status, message, data };
}

/**
 * Generate a new token
 * @param user A user object.
 */
auth.generateToken = (user) => {
  return jwt.sign({ user, expiry: "10h"}, secret);
}
/**
 * Verifies a token.
 * @param token The token to verify.
 * @return True - Success, False - Not verified.
 */
auth.verifyToken = (token) => {
  try {
    var decoded = jwt.verify(token, secret);
    return true;
  } catch(err) {
    return false;
  }
}

/**
 * Guards end point using JWT.
 */
auth.guardEndpoint = (req, res, next) => {
  var authHeader = req.headers.authorization;
  var token = auth.getBearerToken(authHeader);
  if (auth.verifyToken(token)) {
    req.token = token;
    next();
  } else {
    res
      .status(401)
      .json({
        'status': 'Failed',
        'message': 'Invalid token',
      })
  }
}
auth.getBearerToken = (authHeader) => {
   return authHeader.split(' ')[1] || null;
}

/**
 * Guards endpoint using HMAC Authentication.
 */
auth.guardEndpointHMAC = (req, res, next) => {
  var authorization = req.headers['authorization'];
  var components = auth.parseHMACHeader(authorization);
  var accesskey = components.key;
  var clientSignature = components.signature;
  var query = 'select sharedsecret from users where accesskey = :accesskey';
  massiveInstance.query(query, { replacements: { accesskey }})
    .then(result => {
      if (result[0].length == 0) {
        res
          .status(401)
          .json(response('Failed', 'Failed Authentication'))
      } else {
        var sharedsecret = result[0][0].sharedsecret;
        let serverSignature;
        
        if (req.body === {}) { // check if body exists.
          serverSignature = 
          crypto.createHmac("sha256", sharedsecret)
            .update(String(req.body) + req.url + accesskey)
            .digest("hex");
        } else {
          serverSignature = 
          crypto.createHmac("sha256", sharedsecret)
            .update(req.url + accesskey)
            .digest("hex");
        }
        if (clientSignature === serverSignature) {
          next();
        } else {
          res
            .status(401)
            .json(response('Failed', 'Failed Authentication'))
        }
      }
    });
}

auth.parseHMACHeader = (header) => {
  var components = header.split(' ');
  var key = components[1].replace('Key=', '');
  var signature = components[2].replace('Signature=', '');
  return { key, signature };
}

auth.keyGen = (bits) => { return keygen.generateKey(bits/16);};