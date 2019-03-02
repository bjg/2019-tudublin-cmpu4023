const port = 3001;
const https = require('http');
const crypto = require('crypto');
const message='Let me in!';
const param='';
const requestType = "GET";

var keys ={
    access_key: '39d16617c4055a027a31e5993fd18fad2a7ffdfb',
    secret_key: '2bb0c7df3e998ed86770b2ae9399a689d7d73e7184069d42c4ac3eb98b1d009645ade59ed6f295a6'
};

//Create a valid signature 
const hmac = crypto.createHmac('sha256', keys.secret_key);
//If a message is passed in the request of the body 
if(requestType === 'POST'){
    hmac.update(message);//Adding message to the hash signature (secret_key + message)
  }
//If a query parameter is passed in the request of the body 
if(param !== undefined){
  hmac.update(param);//Adding message to the hash signature (secret_key + message)
}
const signature = hmac.digest('hex');//generate a valid signature
console.log("hashed signature: " + signature);
const options = {
    hostname: 'localhost',
    port: port,
    path: "/products",
    // ?name=" + param,
    method: requestType,//Use POST to send message body
    headers:{
      'Content-Type': 'application/json',
      'access_key':keys.access_key,
      'signature':signature
    }
  };
  
  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log('headers:', res.headers);

    
    res.setEncoding('utf8');
    res.on('data', (d) => {
      process.stdout.write(d)
    })
  })
  
  req.on('error', (error) => {
    console.error('problem with request:' + error);
  })
  // write data to request body (POST)
  if(requestType === 'POST'){
    req.write('{"message":'+'"'+message+'"}');
  }
  
  req.end()
  