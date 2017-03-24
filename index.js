'use strict'
let express = require('express'),
	app = express()

app.set('port', process.env.PORT || 8080)

// run
app.listen(app.get('port'), () => {
	console.info('App is running on port ', app.get('port'))
})


require('./backend/routes')(app)