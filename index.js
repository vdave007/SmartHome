"use strict"
let express = require('express'),
	bodyParser = require('body-parser'),
 	app = express(),
 	DataBase = require('./backend/database'),
	CurrentAI = require('./backend/currentai'),
	Encrypter = require('./backend/models/Encrypter'),
	Mail = require('./backend/models/Mail'),
	Sms = require('./backend/models/Sms'),
	DeviceSelector = require('./backend/deviceselector'),
	server = require('http').createServer(app),
	io = require('socket.io')(server)



app.set('port', process.env.PORT || 8080)

app.use(express.static(__dirname + ''))

app.use(bodyParser());

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


server.listen(app.get('port'), () => {
	console.info('App is running on port ', app.get('port'))
})

var ai = new CurrentAI()

var dataBase = new DataBase()

var encrypter = new Encrypter();

var mail = new Mail();

var sms = new Sms();

var deviceselector = new DeviceSelector(dataBase);

require('./backend/routes')(app,dataBase,ai,encrypter,mail,sms,deviceselector)
require('./backend/socket')(io)