"use strict"
let mongoose = require('mongoose'),
	path = require('path'),
	RawData = require(path.resolve('./backend/models/rawdata.js')),
	Amper = require(path.resolve('./backend/models/Amper')),
	DeviceSetting = require(path.resolve('./backend/models/DeviceSetting')),
	House = require(path.resolve('./backend/models/House')),
	User = require(path.resolve('./backend/models/User')),
	UserHouse = require(path.resolve('./backend/models/UserHouse')),
	ResetPassword = require(path.resolve('./backend/models/ResetPassword')),
	UserSmartWatch = require(path.resolve('./backend/models/UserSmartWatch'))

var DataBase = module.exports = function () {
	this.mongoose = mongoose
	this.init()
}

DataBase.prototype.init = function () {
	var self = this
	self.mongoose.Promise = global.Promise;

	self.mongoose.connection.on('open', (ref) => {
		console.info('Connected to mongo server.', ref)
	})

	self.mongoose.connection.on('error', (error) => {
		console.error('Could not connect to mongo server!', error)
	})

	connectWithRetry(self) 
}

function connectWithRetry(self){
		console.info('itt')
	    //return self.mongoose.connect('mongodb://localhost/smartHome', function(err) {
		return self.mongoose.connect('mongodb://heroku_xr2pj2sw:478kj7lelu6klbrklj3fbmnink@ds139869.mlab.com:39869/heroku_xr2pj2sw', function(err) {
	        if (err) {
	            console.error('Failed to connect to mongo on startup - retrying in 1 sec', err);
	            setTimeout(connectWithRetry(self), 1000);
	        }
	    });
}

/**
 * Close method to handle the connection close explicitely 
 */
DataBase.prototype.close = function () {

	var self = this 
	
	self.mongoose.Promise = global.Promise

	self.mongoose.connection.close(function () {
		console.log('Mongoose default connection disconnected through app termination');
					
	})
}


DataBase.prototype.createRawInformation = function(cid,date,v1,v2,v3,v4,_callback) {
	var self = this

	var t = new RawData({  
		controllerID : cid,
		time   : date,
		value1 : v1,
		value2 : v2,
		value3 : v3,
		value4 : v4
	})
	
	t.save(function(err) {
		if (err) 
			return _callback(err)
	})
	return _callback(null)
}

/**
 *  From Akos Db methods       ----      Amper need change to Watt 
 */ 

DataBase.prototype.getAmperInterval = function (house_id, datefrom, dateto, _callback) {

	Amper.find({'amperdate': { '$gte': datefrom, '$lt': dateto }}, '-_id -__v', (error, ampers) => {
		if (error) { return _callback(null) }
		return _callback(ampers)
	}).where('house_id').equals(house_id)
}

DataBase.prototype.getDeviceSetting = function (house_id, _callback) {

	DeviceSetting.find({}, '-_id -__v', (error, ampers) => {
		if (error) { return _callback(null) }
		return _callback(ampers)
	}).where('house_id').equals(house_id)
}

DataBase.prototype.createDeviceSettingMessage = function (hid,n,icid,v,vd,_callback){
	var self = this

	var t = new DeviceSetting({  
		house_id : hid,
		name : n,
		icon_id : icid,
		value : v,
		valuedelay : vd
	})
	DeviceSetting.findOne({ house_id: hid, value: v }, function (err, doc){	
		if (err || doc == null) 
		{
			t.save(function(err) {
					if (err) 
						return _callback(err)
			})
		}
		else
		{
			console.log(doc)
			doc.name = n;
			doc.icon_id = icid;
			doc.valuedelay = vd;
			doc.save();
			console.log(doc)
		}
	});
	
	return _callback(null)
}

DataBase.prototype.deleteDeviceSettingMessage = function (hid,v,_callback){
	var self = this
	
	DeviceSetting.findOne({house_id:hid, value: v }, function (err, doc){	
		if (err || doc != null) 
		{
			doc.remove(function(err) {
					if (err) 
						return _callback(err)
			})
		}
	});
	
	return _callback(null)
}

DataBase.prototype.getHouses = function (_callback) {

	House.find({}, '-_id -__v', (error, houses) => {
		if (error) { return _callback(null) }
		return _callback(houses)
	}) 
}

DataBase.prototype.getUserHouses = function (user_email,_callback) {

	UserHouse.find({user_email : user_email}, '-_id -__v', (error, userhouses) => {
		if (error) { return _callback(null) }
		if (userhouses != null)
		{
			var ds = []
			House.find({}, '-_id -__v', (error, houses) => {
				if (houses != null)
				{
					userhouses.forEach(function(userhouse) {
						houses.forEach(function(house){
							if (userhouse.house_id == house.house_id)
							{
								ds.push(house)
							}
						})
					})
				}
			return _callback(ds)	
			})
		}
	}) 
}

DataBase.prototype.createHouseMessage = function (hname,hid,passwd,_callback){
	var self = this
	
	House.findOne({"house_id":hid },'-_id -__v',(error, house) => {
		if (house == null) 
		{			
			console.log("h---------------id : "+hid)
			var t = new House({  
				house_id : hid,
				house_name : hname,
				password : passwd
			})
			
			t.save(function(err) {
					if (err) 
						return _callback(false)
					return _callback(true)
			})
		}
		else return _callback("van mar")
	}).sort({ 'house_id': 'ascending' })
}

DataBase.prototype.updateHouseMessage = function (hid,hname,passwd,_callback){
	var self = this
	
	var t = new House({  
		house_id : hid,
		house_name : hname,
		password : passwd
	})

	House.findOne({ house_id: hid }, function (err, doc){	
		if (err || doc == null) 
		{
			t.save(function(err) {
					if (err) 
						return _callback(err)
			})
		}
		else
		{
			console.log(doc)
			doc.house_name = hname
			doc.password = passwd
			doc.save(function(err) {
					if (err) 
						return _callback(false)
					return _callback(true)
			})
		}
	});
	
	return _callback(null)
}

DataBase.prototype.updateHouseName = function (hname,hid,_callback){
	var self = this
	
	House.findOne({"house_id":hid },(error, house) => {
		if (error || house == null) 
		{	
		}
		else
		{
			console.log("h---------------id : "+hid, house)
			house.house_name = hname
			house.save()
			return _callback(true)
		}
	})
}

DataBase.prototype.getHousesByName = function (hname,_callback){
	var self = this
	
	House.find({ "house_name": { "$regex": hname, "$options": "i" } }, '-_id -__v', (error, houses) => {
		if (error) { return _callback(null) }
		return _callback(houses)
	})
}

DataBase.prototype.getHousesById = function (hid ,_callback){
	var self = this
	console.log("----",hid)
	House.find( {"$where": "function() { return this.house_id.toString().match(/"+hid+"/) != null; }"}, '-_id -__v', (error, houses) => {
		if (error) { return _callback(null) }
		return _callback(houses)
	})
}

DataBase.prototype.createUserMessage = function (u_email,passwd,_callback){
	var self = this
	
	var t = new User({  
		user_email : u_email,
		password : passwd
	})
	
	User.findOne({ user_email: u_email }, function (err, doc){	
		if (err || doc == null) 
		{
			t.save(function(err) {
					if (err) 
						return _callback(false)
					return _callback(true)
			})
		}
		else 
		{
			doc.password = passwd;
			doc.save(function(err) {
					if (err) 
						return _callback(false)
					return _callback(true)
			})
		}
	});
}

DataBase.prototype.createUserMessage = function (u_email,passwd,number,_callback){
	var self = this
	
	// create a Temperature json object 
	var t = new User({  
		user_email : u_email,
		password : passwd,
		phone_number : number
	})
	
	User.findOne({ user_email: u_email }, function (err, doc){	
		if (err || doc == null) 
		{
			t.save(function(err) {
					if (err) 
						return _callback(false)
					return _callback(true)
			})
		}
		else 
		{
			doc.password = passwd;
			doc.phone_number = number;
			doc.save(function(err) {
					if (err) 
						return _callback(false)
					return _callback(true)
			})
		}
	});
}

DataBase.prototype.LoginUser = function (u_email,passwd,_callback){
	var self = this
	
	User.findOne({ user_email: u_email,password : passwd }, function (err, doc){	
		if (err || doc == null) 
		{
			User.findOne({ user_email: u_email }, function (err, doc){
				if (err || doc == null)
				{
					return _callback('false')
				}
				else 
					return _callback('Wrong password')
			});
		}
		else 
		{
			return _callback('true')
		}
	});
}

DataBase.prototype.UserPhoneNumber = function (u_email,_callback){
	var self = this
	
	User.findOne({ user_email: u_email }, function (err, doc){	
		if (err || doc == null) 
		{
			return _callback(false)
		}
		else 
		{
			return _callback(doc.phone_number)
		}
	});
}

DataBase.prototype.LoginSmartWatch = function (smartwatch_id,_callback){
	var self = this
	
	UserSmartWatch.findOne({ smartwatch_id: smartwatch_id }, function (err, doc){	
		if (err || doc == null) 
		{
			return _callback(false)
		}
		else 
		{
			return _callback(true)
		}
	});
}

DataBase.prototype.getSmartWatchUser = function (smartwatch_id,_callback){
	var self = this
	
	UserSmartWatch.find({ smartwatch_id: smartwatch_id }, '-_id -__v -smartwatch_id', (error, users) => {
		if (error) { return _callback(null) }
		return _callback(users)
	})
}

DataBase.prototype.getUserSmartWatch = function (user_email,_callback){
	var self = this
	
	UserSmartWatch.find({ user_email: user_email }, '-_id -__v -user_email', (error, users) => {
		if (error) { return _callback(null) }
		return _callback(users)
	})
}

DataBase.prototype.createUserHouseMessage = function (u_email,h_id,passwd, _callback){
	var self = this
	
	var t = new UserHouse({  
		user_email : u_email,
		house_id : h_id
	})
	
	User.findOne({user_email:u_email, password : passwd},function(err, doc) {
	    if (err || doc == null)
	    {
	    	return _callback(err)
	    }
	    else
	    {
			UserHouse.findOne({ user_email: u_email,house_id : h_id }, function (err, doc){	
				if (err || doc == null) 
				{
					t.save(function(err) {
							if (err) 
								return _callback(err)
							return _callback(true)
					})
				}
				else 
				{
					return _callback(false)
				}
			});	
	    }
	})
	
}

DataBase.prototype.createUserSmartWatchMessage = function (user_email,smartwatch_id,_callback){
	var self = this
	
	var t = new UserSmartWatch({  
		user_email : user_email,
		smartwatch_id : smartwatch_id
	})
	
	User.findOne({user_email:user_email},function(err, doc) {
	    if (err || doc == null)
	    {
	    	return _callback(err)
	    }
	    else
	    {
			UserSmartWatch.findOne({ user_email: user_email,smartwatch_id : smartwatch_id }, function (err, doc){	
				if (err || doc == null) 
				{
					t.save(function(err) {
							if (err) 
								return _callback(err)
							return _callback(true)
					})
				}
				else 
				{
					return _callback(false)
				}
			});	
	    }
	})
}

DataBase.prototype.deleteUserHouse = function (u_email,h_id,_callback){
	var self = this
	
	User.findOne({user_email:u_email},function(err, doc) {
	    if (err || doc == null)
	    {
	    	return _callback(false)
	    }
	    else
	    {
	    	console.log('torol userhouse : ' +doc);
			UserHouse.findOne({ user_email: u_email,house_id : h_id }, function (err, doc){	
				if (err || doc == null) 
				{
					return _callback(false);
				}
				else 
				{
					doc.remove();
					return _callback(true);
				}
			});	
	    }
	})
	
}

DataBase.prototype.savePasswordReset = function (u_email,r_code,expire_time,_callback){
	var self = this
	
	var t = new ResetPassword({  
		user_email : u_email,
		reset_code : r_code,
		expire : expire_time
	})
	
	ResetPassword.findOne({ user_email: u_email }, function (err, doc){	
		if (err || doc == null) 
		{
			t.save(function(err) {
					if (err) 
						return _callback(err)
					return _callback(true)
			})
		}
		else 
		{
			doc.reset_code = r_code;
			doc.expire = expire_time;
			doc.save(function(err) {
					if (err) 
						return _callback(err)
					return _callback(true)
			})
		}
	});
}

DataBase.prototype.getResetPassword = function (user_email,_callback){
	var self = this
	
	ResetPassword.findOne({ user_email: user_email }, '-_id -__v -user_email', (error, resetpasswd) => {
		if (error) { return _callback(null) }
		return _callback(resetpasswd)
	})
}