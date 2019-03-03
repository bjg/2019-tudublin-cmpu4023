const crypto = require('crypto');
const fetch = require('node-fetch');
const SK = "ynq4f6xEP2gdk8tuT453s74upPPQimdfxjOcWnOX";
const AK = 'UbgAKlndI0yXVdNBq3OE';

const messageBody =JSON.stringify(
    {name:"pencil",price:"2"});

const signature = AK+messageBody;
console.log(signature);
let hash = crypto.createHmac('SHA256', SK).update(signature).digest('hex');
console.log(hash);
const options =  {
    method: 'POST',
    headers:{
        'Access': AK,
        'Signature':hash,
        'Content-Type': 'application/json'
    },
    body: messageBody
    };
fetch("http://127.0.0.1:3000/products",options
).then(res => res.json())
.then(res => console.log('Succesfull Post', JSON.stringify(res)))
.catch(err => console.log('Unsuccesfull Post with error:', err));