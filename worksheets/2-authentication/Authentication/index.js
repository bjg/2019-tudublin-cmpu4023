/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 2
 *	Questions: All
 *	Type: Entry File."
 ***/

const app = require('./server.js');
const config = require('./config.js');

app.listen(config.PORT_APP, () => {
    
    console.log("Server succesfully started and running on port: " + config.PORT_APP);
    
});
