const CryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");
const axios = require("axios");
const argv = require("minimist")(process.argv.slice(2));

axios(argv._[0], {
    method: argv.X.toLowerCase(),
    headers: { Authorization: token() },
    data: {
		value : argv.d
	}
}).then(function(res) {}).catch(error => console.log(error));    

//create the signature from url, data, and key
function token() {
    const data = `${argv._}${argv.d}${argv.a}`;
    const signature = CryptoJS.HmacSHA256(data, argv.s);
    return `HMAC-SHA256 Key=${argv.a} Signature=${Base64.stringify(signature)}`;
}