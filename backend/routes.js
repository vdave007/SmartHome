"use strict"
let path = require('path')

var v1;
var v2;
var v3;
var v4;

module.exports = (app,dataBase) => {


	app.get('/getamper', (req, res) => {
			var house_id = req.param('house_id')
	        console.log("Az utolso Amper",house_id)
			if (typeof house_id === 'undefined') house_id = 1
			house_id = parseInt(house_id)
			var responseJson = [{"house_id":1,"ampervalue":v1*0.22,"amperdate":123},
								{"house_id":1,"ampervalue":v2*0.22,"amperdate":123},
								{"house_id":1,"ampervalue":v3*0.22,"amperdate":123},
								{"house_id":1,"ampervalue":v4*0.22,"amperdate":123}]
			// db.getAmper(house_id,function(returndata){
				console.log("Response -----------------");
				console.log(responseJson)
				res.json(responseJson)
			// })
	})



	app.get('/saveRawData', (req, res) => {
		res.json({info: "This is my backend!"})
		console.log(req.query);
		var cid = req.query.cid
		var _date = new Date()
		var date = _date.getTime()
		v1 = req.query.v1
		v2 = req.query.v2
		v3 = req.query.v3
		v4 = req.query.v4
		console.log(cid,date,v1,v2,v3,v4)
		dataBase.createRawInformation(cid,date,v1,v2,v3,v4,function(error){
			if(error){
				console.error('error:',error)
			}
		})
	})




}