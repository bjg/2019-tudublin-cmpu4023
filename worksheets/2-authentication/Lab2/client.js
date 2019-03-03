const fetch = require('node-fetch');
const crypto = require('crypto');

const secretKey = "108f07b8382412612c048d07d13f814118445acd";
const accessKey = "eb0cf45114c56a8421fbcb33430fa22e0cd607560a88bbe14ce70bdf59bf55b11a3906987c487992";

const messageBody =JSON.stringify({name:"wandersPhone",price:"700"});

const joined = accessKey+messageBody;
let client_hash = crypto.createHmac('SHA256', secretKey).update(joined).digest('hex');
console.log(client_hash);
fetch("http://127.0.0.1:3000/hmac/products",{
    method: 'POST',
    headers:{
    	'Content-Type': 'application/json',
        'Access': accessKey,
        'Signature':client_hash,
    },
    body: messageBody
    }
).then(res => res.json()).then(json => console.log(json));