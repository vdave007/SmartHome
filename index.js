"use strict"
let express = require('express'),
	bodyParser = require('body-parser'),
 	app = express(),
 	DataBase = require('./backend/database')

app.set('port', process.env.PORT || 8080)

app.use(express.static(__dirname + ''))

app.use(bodyParser());

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.listen(app.get('port'), () => {
	console.info('App is running on port ', app.get('port'))
})


var dataBase = new DataBase()

require('./backend/routes')(app,dataBase)
