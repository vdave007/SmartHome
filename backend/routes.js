let path = require('path')

module.exports = (app,dataBase) => {

	app.get('*', (req, res) => {
		res.json({info: "This is my backend!"})
		dataBase.createRawInformation(1,2,3,4,5,function(returnData){
			
		})
	})

}