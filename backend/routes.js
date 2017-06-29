"use strict"
let path = require('path')


module.exports = (app,dataBase,ai) => {

	app.get('/device/getConfigurationPage', (req,res) => {
		res.sendFile(path.resolve('./backend/pages/configpage.html'))
	})

	app.get('/device/getUniqueIdentifier', (req,res) => {
		res.send('xxxx-xxxx-yyxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		}))
	})

	app.get('/api/getCurrentlyWorkingDevices', (req,res) => {
		var cid = req.param('cid')
		var responseJson = ai.getCurrentlyWorkingDevicesJSON(cid,0)
		console.log(responseJson)
		res.json(responseJson)
	})

	app.get('/getamper', (req, res) => {
			var cid = req.param('cid')
			var latestData = ai.getLatestValues(cid)
			if(latestData==undefined)
			{
				res.send('INVALID CID!')
				return
			}
			console.log('Getting data',latestData)

	        console.log("The latest measurment on device ",cid)
						
			// db.getAmper(house_id,function(returndata){
			var responseJson = [{"cid":cid,"ampervalue":latestData[0],"amperdate":123},
								{"cid":cid,"ampervalue":latestData[1],"amperdate":123},
								{"cid":cid,"ampervalue":latestData[2],"amperdate":123},
								{"cid":cid,"ampervalue":latestData[3],"amperdate":123}]
				console.log("Response -----------------");
				console.log(responseJson)
				res.json(responseJson)
			// })
	})

	app.post('/device/saveRawData', (req, res) => {
		var objBody;
		console.log('-                                -')
		if(req.query.cid != undefined){
			objBody = req.query
			console.log(req.query);
		}
		else{
			objBody = req.body
			console.log(req.body);
		}
		var cid = objBody.cid
		if(cid ==undefined){
			console.error('NO DEVICE ID!')
			res.send("No Device ID!")
		}
		var _date = new Date()
		var date = _date.getTime()

		var v1 = parseInt(objBody.v1)*0.22
		var v2 = parseInt(objBody.v2)*0.22
		var v3 = parseInt(objBody.v3)*0.22
		var v4 = parseInt(objBody.v4)*0.22

		ai.addValues(cid,v1,v2,v3,v4)
		console.log(cid,date,v1,v2,v3,v4)
		dataBase.createRawInformation(cid,date,v1,v2,v3,v4,function(error){
			if(error){
				console.error('error:',error)
			}
		})
		res.send("OK");
	})

	app.get('/', (req,res) => {
		res.send("SmartHomeServer")
	})



}
