'use strict'
let express = require('express'),
		app = express(),
		bodyParser = require('body-parser'),
		server = require('http').createServer(app),
		io = require('socket.io')(server)

app.set('port', process.env.PORT || 8080)

app.use(bodyParser());

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


// run
server.listen(app.get('port'), () => {
 console.info('App is running on port ', app.get('port'))
})

require('./backend/routes')(app)
require('./backend/socket')(io)