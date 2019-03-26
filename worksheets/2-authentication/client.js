var crypto = require('crypto');
var commandLineArgs = require('command-line-args')

var optionDefinitions = [
  { name: 'accesskey', alias: 'a', type: String },
  { name: 'secret', alias: 's', type: String },
  { name: 'url', alias: 'u', type: String },
  { name: 'httpbody', alias: 'b', type: String }
]


var options = commandLineArgs(optionDefinitions)
var accesskey = options.accesskey;
var secret = options.secret;
var url = options.url;
var body = options.httpbody;

let signature = null;
if (body === undefined) {
  signature = crypto.createHmac('sha256', secret).update(url + accesskey).digest('hex');
} else {
  signature = crypto.createHmac('sha256', secret).update(body + url + accesskey).digest('hex');
}
console.log(`Authorization: HMAC-SHA256 Key=${accesskey} Signature=${signature}`)