"use strict"
let path = require('path'),
	validator = require('validator')

var v1 = 2*1000;
var v2 = 6.5*1000;
var v3 = 2.2*1000;
var v4 = 3.65*1000;

module.exports = (app,dataBase,ai,encrypter,mail,sms,deviceselector) => {

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

		v1 = parseInt(objBody.v1)*0.22
		v2 = parseInt(objBody.v2)*0.22
		v3 = parseInt(objBody.v3)*0.22
		v4 = parseInt(objBody.v4)*0.22

		ai.addValues(cid,v1,v2,v3,v4)
		console.log(cid,date,v1,v2,v3,v4)
		// dataBase.createRawInformation(cid,date,v1,v2,v3,v4,function(error){
		// 	if(error){
		// 		console.error('error:',error)
		// 	}
		// })
		res.send("OK");
	})

	app.get('/', (req,res) => {
		res.send("SmartHomeServer")
	})

	/**
	 *  routes for android devices 
	 * 
	 * 	- add to path /api/*   
	 */

	app.get('/api/getdeviceswithsettings', (req, res) => { ///getliveamper
			var house_id = req.param('house_id')
	        console.log("Az utolso Amper",house_id)
			if (typeof house_id === 'undefined') house_id = "1"
			var responseJson = [{"house_id":1,"ampervalue":v1*0.22,"amperdate":123},
								{"house_id":1,"ampervalue":v2*0.22,"amperdate":123},
								{"house_id":1,"ampervalue":v3*0.22,"amperdate":123},
								{"house_id":1,"ampervalue":v4*0.22,"amperdate":123}]
			deviceselector.asyncGetActualDevicesWithSettings(responseJson,house_id,function(datatouser){
				res.json(datatouser)
			})
	})

	app.get('/api/setdevicesetting', (req,res) => {
	
		console.log('feltolt setting');
		
		var house_id = req.param('house_id')
		var name = req.param('name')
		var icon_id = req.param('icon_id')
		var value = req.param('value')
		var valuedelay = req.param('valuedelay')
		if (typeof house_id === 'undefined') return
		if (typeof icon_id === 'undefined') return
		if (typeof value === 'undefined') return
		if (typeof valuedelay === 'undefined') return
		icon_id = parseInt(icon_id)
		value = parseInt(value)
		valuedelay = parseInt(valuedelay)
		console.log('frissit',valuedelay);
		
		dataBase.createDeviceSettingMessage(house_id,name,icon_id,value,valuedelay,function(err){
			if (err) console.error(err) 
			res.json('success');           
		})
	})

	app.get('/api/deletedevicesetting', (req,res) => {
	
		console.log('feltolt setting');
		
		var house_id = req.param('house_id')
		var value = req.param('value')
		if (typeof house_id === 'undefined') return
		if (typeof value === 'undefined') return
		
		value = parseInt(value)
		
		console.log("----torol ",house_id,value)
		dataBase.deleteDeviceSettingMessage(house_id,value,function(err){
			if (err) console.error(err) 
			res.json('success');           
		})
	})

	app.get('/api/getampers', (req, res) => {
		var house_id = req.param('house_id')
		var datefrom = req.param('date_from')
		var dateto = req.param('date_to')
		console.log("Az osszes amper ",datefrom,dateto)
		if (typeof house_id === 'undefined') house_id = "1"

		dataBase.getAmperInterval(house_id,datefrom,dateto,function(returndata){
			res.json(returndata)
		})

	})

	app.get('/api/getdevicesetting', (req, res) => {
		var house_id = req.param('house_id')
		console.log('devsett----')
		if (typeof house_id === 'undefined') house_id = "1"

		dataBase.getDeviceSetting(house_id,function(returndata){
			res.json(returndata)
		})
	})

	app.get('/api/gethouses', (req, res) => {
        console.log("hAzak")
       
		dataBase.getHouses(function(returndata){
			console.log(returndata)
			res.json(returndata)
		})
	})

	app.get('/api/getuserhouses', (req, res) => {
        console.log("hAzak")
        var user_email = req.param('user_email')
		console.log('devsett----with settings')
		if (typeof user_email === 'undefined') return
		
		dataBase.getUserHouses(user_email, function(returndata){
		res.json(returndata)	
		})
	})

	app.get('/api/gethousesbyname', (req, res) => {
        console.log("hAzaklkj")
		var house_name = req.param('house_name')
		if (typeof house_name === 'undefined' || house_name == "") {res.json(null); return}
		dataBase.getHousesByName(house_name, function(returndata){
			 console.log(returndata)
			res.json(returndata)
		})
	})

	app.get('/api/gethousesbyid', (req, res) => {
        console.log("hAzaklkj")
		var house_id = req.param('house_id')
		if (typeof house_id === 'undefined' || house_id == "") {res.json(null); return}
		dataBase.getHousesById(house_id, function(returndata){
			 console.log(returndata)
			res.json(returndata)
		})
	})

	app.get('/api/sethouse', (req,res) => {
			
		var house_name = req.param('house_name')
		var house_id = req.param('house_id')
		if (typeof house_name === 'undefined') house_name = ""	
		if (typeof house_id === 'undefined' || house_id=="") { res.json(null); return }
		console.log('feltolt house ' +house_name,house_id);

		var passwd = encrypter.encrypt("vad")

		dataBase.createHouseMessage(house_name,house_id,passwd,function(err){
			res.json(err);           
		})
	})
	
	app.get('/api/updatehousename', (req,res) => {
			
		var house_name = req.param('house_name')
		var house_id = req.param('house_id')
		if (typeof house_name === 'undefined') return	
		if (typeof house_id === 'undefined' || house_id=="") { res.json(null); return }
		console.log('feltolt house ' +house_name,house_id);

		dataBase.updateHouseName(house_name,house_id,function(err){
			res.json(err);           
		})
	})

	app.get('/api/setuser', (req,res) => {
			
		var user_email = req.param('user_email')
		var password = req.param('password')
		var number = req.param('number')
		console.log('feltolt user : ' +user_email,password);
		if (typeof user_email === 'undefined') return
		if (typeof password === 'undefined') return
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		if (number === '')
			dataBase.createUserMessage(user_email,encrypter.encrypt(password),function(err){
				res.json(err)
			})
		else 
			dataBase.createUserMessage(user_email,encrypter.encrypt(password),number,function(err){
				res.json(err)
			})
	})

	app.get('/api/login', (req,res) => {
			
		var user_email = req.param('user_email')
		var password = req.param('password')
		console.log('login : ' +user_email,password);
		if (typeof user_email === 'undefined') {res.json('Email required'); return}
		if (typeof password === 'undefined') { res.json('Password required'); return}

		if (!validator.isEmail(user_email)) {res.json('Wrong email address'); return}

		dataBase.LoginUser(user_email,encrypter.encrypt(password),function(isregisterd){
			if (isregisterd !== 'undefined'	) 
				res.json(isregisterd);           
		})
	})

	app.get('/api/smartwatchlogin', (req,res) => {
			
		var smartwatch_id = req.param('smartwatch_id')

		console.log('smartwatchlogin : ' +smartwatch_id);
		if (typeof smartwatch_id === 'undefined') return

		dataBase.LoginSmartWatch(smartwatch_id,function(isregisterd){
			if (isregisterd !== 'undefined'	) 
				res.json(isregisterd);           
		})
	})

	app.get('/api/setuserhouse', (req,res) => {
			
		var user_email = req.param('user_email')
		var house_id = req.param('house_id')
		var passwd = req.param('password')
		console.log('feltolt userhouse : ' +user_email , house_id);
		if (typeof user_email === 'undefined') {res.json('Wrong email'); return}
		if (typeof house_id === 'undefined') {res.json('Wrong id'); return}
		if (typeof passwd === 'undefined') {res.json('Wrong password'); return}
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		dataBase.createUserHouseMessage(user_email,house_id,encrypter.encrypt(passwd),function(err){
			res.json(err)
		})
	})
	
	app.get('/api/deleteuserhouse', (req,res) => {
			
		var user_email = req.param('user_email')
		var house_id = req.param('house_id')
		console.log('torol userhouse : ' +user_email , house_id);
		if (typeof user_email === 'undefined') return
		if (typeof house_id === 'undefined') return
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		dataBase.deleteUserHouse(user_email,house_id,function(err){
			res.json(err)
		})
	})

	app.get('/api/setusersmartwatch', (req,res) => {
			
		var user_email = req.param('user_email')
		var smartwatch_id = req.param('smartwatch_id')
		console.log('feltolt userSmartWatch : ' +user_email,smartwatch_id);
		if (typeof user_email === 'undefined') return
		if (typeof smartwatch_id === 'undefined') return
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		dataBase.createUserSmartWatchMessage(user_email,smartwatch_id,function(err){
			res.json(err)
		})
	})

	app.get('/api/getsmartwatchuser', (req, res) => {

        var smartwatch_id = req.param('smartwatch_id')
        console.log("smartwatchuser",smartwatch_id)
		if (typeof smartwatch_id === 'undefined') return
		
		dataBase.getSmartWatchUser(smartwatch_id, function(returndata){
		res.json(returndata)	
		})
	})
	
	app.get('/api/getusersmartwatch', (req, res) => {

        var user_email = req.param('user_email')
        console.log("usersmartwatches",user_email)
		if (typeof user_email === 'undefined') return
		
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		dataBase.getUserSmartWatch(user_email, function(returndata){
		res.json(returndata)	
		})
	})

	app.get('/api/resetuserpassword', (req, res) => {

        var user_email = req.param('user_email')
        var inmail = req.param('inmail')
        var reset_code = req.param('reset_code')
        console.log("rest user password ",user_email)
		if (typeof user_email === 'undefined') return
		
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		var reset_code = 'xxxxx'.replace(/[x]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			 return v.toString(16);
		});
		if (inmail === 'undefined' || inmail === "True")
		{
			mail.sendMail(user_email,reset_code)
			console.log("mail",inmail)
		}
		else
		{ 
			dataBase.UserPhoneNumber(user_email,function(phone_number){
				console.log("inmail ? ",inmail, phone_number)
				if (phone_number != false)
				if (phone_number != undefined)
				{
					if (phone_number.match("([0-9]{10})"))
					{
						sms.sendSms(phone_number,reset_code);
					}
					else
					{	
						mail.sendMail(user_email,reset_code)
					}
				}
				else
					{	
						mail.sendMail(user_email,reset_code)
					}
			});
		}
		console.log('resetcode = ', reset_code)
		dataBase.savePasswordReset(user_email,reset_code,new Date().getTime(),function(returndata){
		res.json(returndata)
		})	
	})

	app.get('/api/getresetuserpassword', (req, res) => {

        var user_email = req.param('user_email')
        var reset_code = req.param('reset_code')
        console.log("get rest user password ",user_email)
		if (typeof user_email === 'undefined') return
		
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		dataBase.getResetPassword(user_email,function(returndata){
		if (returndata != null)
		{
			console.log(returndata.reset_code,returndata.expire);
			if ((returndata.expire + 60000*5) > new Date().getTime())
			{
					console.log("not expired");
					if (returndata.reset_code == reset_code)
					{
						console.log("reset_codes match");
						res.json(true);
						return;
					}
			}
			res.json(false);
			return;
		}
		else
			res.json(false);
		})
	})
}
