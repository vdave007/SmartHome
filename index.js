let express = require('express'),
 	app = express(),
 	DataBase = require('./backend/database')

app.set('port', process.env.PORT || 8081)

app.use(express.static(__dirname + ''))

app.listen(app.get('port'), () => {
	console.info('App is running on port ', app.get('port'))
})


dataBase = new DataBase()

require('./backend/routes')(app,dataBase)