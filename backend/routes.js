'use strict'

let path = require('path'),
DeviceSetting = require('./Models/DeviceSetting')

var Db = require('./Models/Dbmodel')
var db = new Db()
var validator = require('validator');
var Encrypter = require('./Models/Encrypter')
var encrypter = new Encrypter();

//var Mail = require('./Models/Mail');
//var mail = new Mail();

var Sms = require('./Models/Sms');
var sms = new Sms();


var v1 = 2*1000;
var v2 = 6.5*1000;
var v3 = 2.2*1000;
var v4 = 3.65*1000;


module.exports = (app) => {


	app.get('/getamper', (req, res) => {
		var house_id = req.param('house_id')
        console.log("Az utolso Amper",house_id)
		if (typeof house_id === 'undefined') house_id = "1"
		db.getAmper(house_id,function(returndata){
			 console.log(returndata)
			res.json(returndata)
		})
	})
	
	//David resze --
	app.get('/getdeviceswithsettings', (req, res) => { ///getliveamper
			var house_id = req.param('house_id')
	        console.log("Az utolso Amper",house_id)
			if (typeof house_id === 'undefined') house_id = "1"
			var responseJson = [{"house_id":1,"ampervalue":v1*0.22,"amperdate":123},
								{"house_id":1,"ampervalue":v2*0.22,"amperdate":123},
								{"house_id":1,"ampervalue":v3*0.22,"amperdate":123},
								{"house_id":1,"ampervalue":v4*0.22,"amperdate":123}]
			db.getDeviceSetting(house_id,function(returndatadevice){
				 if (returndatadevice != null)
				 {
					 var ds = []
					 responseJson.forEach(function(actualdevice) {
					 	if (actualdevice.ampervalue != 0)
						{	
							var find = false;
							returndatadevice.forEach(function(saveddevice) {
								
								if (saveddevice.value - saveddevice.valuedelay <= actualdevice.ampervalue 
								&& saveddevice.value + saveddevice.valuedelay >= actualdevice.ampervalue)
								{
									find = true;
									saveddevice.original_value = parseInt(saveddevice.value)
									var data = {  
										house_id : house_id,
										name : saveddevice.name,
										icon_id : saveddevice.icon_id,
										value : parseInt(actualdevice.ampervalue),
										original_value : parseInt(saveddevice.value),
										valuedelay : saveddevice.valuedelay
									}
									ds.push(data)
								}
							},this)
							if (!find)
							{
								var data = {  
									house_id : house_id,
									name : "Unknown",
									icon_id : 0,
									value : parseInt(actualdevice.ampervalue),
									original_value : parseInt(actualdevice.ampervalue),
									valuedelay : 1
								}
								ds.push(data)
							}
						}	
					}, this);
					//console.log(ds)
					res.json(ds)
				 }
				
				
			})
			// db.getAmper(house_id,function(returndata){
			//	console.log("Response -----------------");
			//	console.log(responseJson)
			//	res.json(responseJson)
			// })
	})
	
	// app.post('/saveRawData', (req, res) => {
	// 	//res.json({info: "This is my backend!"})
	// 	console.log(req.query);
	// 	var cid = req.query.cid
	// 	var _date = new Date()
	// 	var date = _date.getTime()
	// 	v1 = req.query.v1
	// 	v2 = req.query.v2
	// 	v3 = req.query.v3
	// 	v4 = req.query.v4
	// 	console.log(cid,date,v1,v2,v3,v4)
	// 	// db.createRawInformation(cid,date,v1,v2,v3,v4,function(error){
	// 	// 	if(error){
	// 	// 		console.error('error:',error)
	// 	// 	}
	// 	// })
	// })
	// // davide reszenek vege --
	app.post('/saveRawData', (req, res) => {
		//res.json({info: "This is my backend!"})
		console.log(req.body);
		var cid = req.body.cid
		var _date = new Date()
		var date = _date.getTime()
		v1 = req.body.v1
		v2 = req.body.v2
		v3 = req.body.v3
		v4 = req.body.v4
		console.log(cid,date,v1,v2,v3,v4)
		res.send("OK");
	})
	

	app.get('/setamper', (req,res) => {
		var house_id = req.param('house_id')
		var ampervalue = parseInt(req.param('ampervalue'))
		console.log('feltolt amper');
		if (typeof ampervalue === 'undefined') ampervalue = 1
		if (typeof house_id === 'undefined') house_id = 1
		house_id = parseInt(house_id)
		db.createAmperMessage(house_id,ampervalue,new Date().getTime(),function(err){
			if (err) console.error(err) 
			res.json('success');           
		})
	})

	app.get('/device/getUniqueIdentifier', (req,res) => {
		res.send('xxxx-xxxx-yyxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		}))
	})

	app.get('/setdevicesetting', (req,res) => {
	
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
		
		db.createDeviceSettingMessage(house_id,name,icon_id,value,valuedelay,function(err){
			if (err) console.error(err) 
			res.json('success');           
		})
	})

	app.get('/deletedevicesetting', (req,res) => {
	
		console.log('feltolt setting');
		
		var house_id = req.param('house_id')
		var value = req.param('value')
		if (typeof house_id === 'undefined') return
		if (typeof value === 'undefined') return
		
		value = parseInt(value)
		
		console.log("----torol ",house_id,value)
		db.deleteDeviceSettingMessage(house_id,value,function(err){
			if (err) console.error(err) 
			res.json('success');           
		})
	})

	app.get('/getampers', (req, res) => {
		var house_id = req.param('house_id')
		var datefrom = req.param('date_from')
		var dateto = req.param('date_to')
		console.log("Az osszes amper ",datefrom,dateto)
		if (typeof house_id === 'undefined') house_id = "1"

		db.getAmperInterval(house_id,datefrom,dateto,function(returndata){
			res.json(returndata)
		})

	})

	app.get('/getdevicesetting', (req, res) => {
		var house_id = req.param('house_id')
		console.log('devsett----')
		if (typeof house_id === 'undefined') house_id = "1"

		db.getDeviceSetting(house_id,function(returndata){
			res.json(returndata)
		})
	})


	// app.get('/getdeviceswithsettings',(req,res)=>{
	// 	var house_id = req.param('house_id')
	// 	console.log('devsett----with settings')
	// 	if (typeof house_id === 'undefined') house_id = 1
	// 	house_id = parseInt(house_id)
	// 	db.getAmper(house_id,function(returndata){
	// 		 //console.log(returndata)
	// 		 if (returndata != null)
	// 		 {
	// 			 db.getDeviceSetting(house_id,function(returndatadevice){
	// 			 if (returndatadevice != null)
	// 			 {
	// 				 var ds = []						
	// 				 returndata.forEach(function(actualdevice) {
	// 					var find = false;
	// 					returndatadevice.forEach(function(saveddevice) {					
	// 						if (saveddevice.value - saveddevice.valuedelay <= actualdevice.ampervalue 
	// 						&& saveddevice.value + saveddevice.valuedelay >= actualdevice.ampervalue)
	// 						{
	// 							saveddevice.value = actualdevice.ampervalue
	// 							find = true;
	// 							ds.push(saveddevice)
	// 						}						
	// 					},this)
	// 					if (!find)
	// 					{
	// 						var data = {  
	// 							house_id : house_id,
	// 							name : "Unknown",
	// 							icon_id : 0,
	// 							value : actualdevice.ampervalue,
	// 							valuedelay : 1
	// 						}
	// 						ds.push(data)
	// 					}	
	// 				}, this);
	// 				console.log(ds)
	// 				res.json(ds)
	// 			 }				 
	// 			 else res.json(null)
	// 			 })
	// 		 }
	// 		//res.json(returndata)
	// 	})
	// })

	app.get('/gethouses', (req, res) => {
        console.log("hAzak")
       
		db.getHouses(function(returndata){
			console.log(returndata)
			res.json(returndata)
		})
	})
	
	app.get('/getuserhouses', (req, res) => {
        console.log("hAzak")
        var user_email = req.param('user_email')
		console.log('devsett----with settings')
		if (typeof user_email === 'undefined') return
		
		db.getUserHouses(user_email, function(returndata){
		res.json(returndata)	
		})
	})

	app.get('/gethousesbyname', (req, res) => {
        console.log("hAzaklkj")
		var house_name = req.param('house_name')
		if (typeof house_name === 'undefined' || house_name == "") {res.json(null); return}
		db.getHousesByName(house_name, function(returndata){
			 console.log(returndata)
			res.json(returndata)
		})
	})

	app.get('/gethousesbyid', (req, res) => {
        console.log("hAzaklkj")
		var house_id = req.param('house_id')
		if (typeof house_id === 'undefined' || house_id == "") {res.json(null); return}
		db.getHousesById(house_id, function(returndata){
			 console.log(returndata)
			res.json(returndata)
		})
	})


	app.get('/sethouse', (req,res) => {
			
		var house_name = req.param('house_name')
		var house_id = req.param('house_id')
		if (typeof house_name === 'undefined') house_name = ""	
		if (typeof house_id === 'undefined' || house_id=="") { res.json(null); return }
		console.log('feltolt house ' +house_name,house_id);

		var passwd = encrypter.encrypt("vad")

		db.createHouseMessage(house_name,house_id,passwd,function(err){
			res.json(err);           
		})
	})
	
	app.get('/updatehousename', (req,res) => {
			
		var house_name = req.param('house_name')
		var house_id = req.param('house_id')
		if (typeof house_name === 'undefined') return	
		if (typeof house_id === 'undefined' || house_id=="") { res.json(null); return }
		console.log('feltolt house ' +house_name,house_id);

		db.updateHouseName(house_name,house_id,function(err){
			res.json(err);           
		})
	})
	
	app.get('/setuser', (req,res) => {
			
		var user_email = req.param('user_email')
		var password = req.param('password')
		console.log('feltolt user : ' +user_email,password);
		if (typeof user_email === 'undefined') return
		if (typeof password === 'undefined') return
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		db.createUserMessage(user_email,encrypter.encrypt(password),function(err){
			res.json(err)
		})
	})
	
	app.get('/login', (req,res) => {
			
		var user_email = req.param('user_email')
		var password = req.param('password')
		console.log('login : ' +user_email,password);
		if (typeof user_email === 'undefined') {res.json('Email required'); return}
		if (typeof password === 'undefined') { res.json('Password required'); return}

		if (!validator.isEmail(user_email)) {res.json('Wrong email address'); return}

		db.LoginUser(user_email,encrypter.encrypt(password),function(isregisterd){
			if (isregisterd !== 'undefined'	) 
				res.json(isregisterd);           
		})
	})
	
	app.get('/smartwatchlogin', (req,res) => {
			
		var smartwatch_id = req.param('smartwatch_id')

		console.log('smartwatchlogin : ' +smartwatch_id);
		if (typeof smartwatch_id === 'undefined') return

		db.LoginSmartWatch(smartwatch_id,function(isregisterd){
			if (isregisterd !== 'undefined'	) 
				res.json(isregisterd);           
		})
	})
	
	app.get('/setuserhouse', (req,res) => {
			
		var user_email = req.param('user_email')
		var house_id = req.param('house_id')
		var passwd = req.param('password')
		console.log('feltolt userhouse : ' +user_email , house_id);
		if (typeof user_email === 'undefined') {res.json('Wrong email'); return}
		if (typeof house_id === 'undefined') {res.json('Wrong id'); return}
		if (typeof passwd === 'undefined') {res.json('Wrong password'); return}
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		db.createUserHouseMessage(user_email,house_id,encrypter.encrypt(passwd),function(err){
			res.json(err)
		})
	})
	
	app.get('/deleteuserhouse', (req,res) => {
			
		var user_email = req.param('user_email')
		var house_id = req.param('house_id')
		console.log('torol userhouse : ' +user_email , house_id);
		if (typeof user_email === 'undefined') return
		if (typeof house_id === 'undefined') return
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		db.deleteUserHouse(user_email,house_id,function(err){
			res.json(err)
		})
	})
	
	
	app.get('/setusersmartwatch', (req,res) => {
			
		var user_email = req.param('user_email')
		var smartwatch_id = req.param('smartwatch_id')
		console.log('feltolt userSmartWatch : ' +user_email,smartwatch_id);
		if (typeof user_email === 'undefined') return
		if (typeof smartwatch_id === 'undefined') return
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		db.createUserSmartWatchMessage(user_email,smartwatch_id,function(err){
			res.json(err)
		})
	})
	
	app.get('/getsmartwatchuser', (req, res) => {

        var smartwatch_id = req.param('smartwatch_id')
        console.log("smartwatchuser",smartwatch_id)
		if (typeof smartwatch_id === 'undefined') return
		
		db.getSmartWatchUser(smartwatch_id, function(returndata){
		res.json(returndata)	
		})
	})
	
	app.get('/getusersmartwatch', (req, res) => {

        var user_email = req.param('user_email')
        console.log("usersmartwatches",user_email)
		if (typeof user_email === 'undefined') return
		
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		db.getUserSmartWatch(user_email, function(returndata){
		res.json(returndata)	
		})
	})
	
	
	app.get('/resetuserpassword', (req, res) => {

        var user_email = req.param('user_email')
        var number = req.param('number')
        var reset_code = req.param('reset_code')
        console.log("rest user password ",user_email)
		if (typeof user_email === 'undefined') return
		
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		var reset_code = 'xxxxx'.replace(/[x]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			 return v.toString(16);
		});
	//	mail.sendMail(user_email,reset_code)
		if (number === 'undefined' || number === "")
		//mail.sendMail(user_email,reset_code)
		;
		else
			sms.sendSms(number,reset_code)
	
		console.log('resetcode = ', reset_code)
		db.savePasswordReset(user_email,reset_code,new Date().getTime(),function(returndata){
		res.json(returndata)
		})	
	})
	
	
	app.get('/getresetuserpassword', (req, res) => {

        var user_email = req.param('user_email')
        var reset_code = req.param('reset_code')
        console.log("get rest user password ",user_email)
		if (typeof user_email === 'undefined') return
		
		if (!validator.isEmail(user_email)) {res.json('hakker'); return}
		
		db.getResetPassword(user_email,function(returndata){
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


