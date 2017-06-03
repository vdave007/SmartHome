"use strict"
let path = require('path')
let FixedMultiQueue = require ('./fixedmultiqueue')

var currentValues = [];


module.exports = (app,dataBase) => {

	app.get('/device/getConfigurationPage', (req,res) => {
		res.sendFile(path.resolve('./backend/pages/configpage.html'))
	})

	app.get('/device/getUniqueIdentifier', (req,res) => {
		res.send('xxxx-xxxx-yyxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		}))
	})

	app.get('/getamper', (req, res) => {
			var cid = req.param('cid')

			if(currentValues[cid]==undefined)
			{
				res.send('INVALID CID!')
				return
			}

			var latestData = currentValues[cid].getLatestDataObject()
			console.log('Getting data',latestData)

	        console.log("The latest measurment on device ",cid)
						
			var responseJson = [{"cid":cid,"ampervalue":parseInt(latestData[0])*0.22,"amperdate":123},
								{"cid":cid,"ampervalue":parseInt(latestData[1])*0.22,"amperdate":123},
								{"cid":cid,"ampervalue":parseInt(latestData[2])*0.22,"amperdate":123},
								{"cid":cid,"ampervalue":parseInt(latestData[3])*0.22,"amperdate":123}]
			// db.getAmper(house_id,function(returndata){
				console.log("Response -----------------");
				console.log(responseJson)
				res.json(responseJson)
			// })
	})

	app.post('/saveRawData', (req, res) => {
		//res.json({info: "This is my backend!"})
		console.log(req.body);
		var cid = req.body.cid
		var _date = new Date()
		var date = _date.getTime()
		if(currentValues[cid]==undefined)
		{
			currentValues[cid] = new FixedMultiQueue(4);
		}
		
		var v1 = req.body.v1
		var v2 = req.body.v2
		var v3 = req.body.v3
		var v4 = req.body.v4
		currentValues[cid].pushInObjectInOrder([v1,v2,v3,v4])
		console.log(cid,date,v1,v2,v3,v4)
		dataBase.createRawInformation(cid,date,v1,v2,v3,v4,function(error){
			if(error){
				console.error('error:',error)
			}
		})
		res.send("OK");
	})




}
