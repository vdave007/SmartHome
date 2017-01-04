let path = require('path')

module.exports = (app,dataBase) => {

	app.get('*', (req, res) => {
		res.json({info: "This is my backend!"})
		console.log(req.query);
		var cid = req.query.cid
		var _date = new Date()
		var date = _date.getTime()
		var v1 = req.query.v1
		var v2 = req.query.v2
		var v3 = req.query.v3
		var v4 = req.query.v4
		console.log(cid,date,v1,v2,v3,v4)
		dataBase.createRawInformation(cid,date,v1,v2,v3,v4,function(error){
			if(error){
				console.error('error:',error)
			}
		})
	})

}