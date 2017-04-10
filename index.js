'use strict'
let express = require('express'),
	app = express(),
	bodyParser = require('body-parser')

app.set('port', process.env.PORT || 8080)

app.use(bodyParser());

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


// run
app.listen(app.get('port'), () => {
	console.info('App is running on port ', app.get('port'))
})


require('./backend/routes')(app)