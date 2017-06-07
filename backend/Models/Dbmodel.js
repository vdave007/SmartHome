'use strict'

let path = require('path'),   
	Amper = require('./Amper'),
	DeviceSetting = require('./DeviceSetting'),
	House = require('./House'),
	User = require("./User"),
	UserHouse = require("./UserHouse"),
	UserSmartWatch = require("./UserSmartWatch"),
	mongoose = require('mongoose')



/** 
 * Create a DB class to handle: 
 *
 */
var Db = module.exports = function ( ) { 

	this.mongoose = mongoose 
	this.lastAliveDate = 0
	this.init()

}


/**
 *  Init the entity layer and others...
 * 
 */
Db.prototype.init = function () {

	var self = this
	self.mongoose.Promise = global.Promise

	// database connection settings
	self.mongoose.connection.on('open', () => {
		console.info('Connected to mongo server.')
	})

	self.mongoose.connection.on('error', (error) => {
		console.error('Could not connect to mongo server!', error)
	})

	// connect to database on mongolab heroku allamvizsga2017
	self.mongoose.connect('mongodb://heroku_xr2pj2sw:478kj7lelu6klbrklj3fbmnink@ds139869.mlab.com:39869/heroku_xr2pj2sw', function (err) {
		if (err) console.error('erros:' + err)
	})

}


/**
 * Close method to handle the connection cloe explicitely 
 */
Db.prototype.close = function () {

	var self = this

	self.mongoose.Promise = global.Promise

	self.mongoose.connection.close(function () {
		console.log('Mongoose default connection disconnected through app termination');

	})
}




/** 
 * get Amper  value 
 */
Db.prototype.getAmper = function (house_id, _callback) {

	Amper.find({}, '-_id -__v', (error, ampers) => {
		if (error) { return _callback(null) }
		return _callback(ampers)
	}).where('house_id').equals(house_id).sort({ 'amperdate': 'descending' }).limit(6)
}

/** 
 * get temperaure  interval vaue  
 */
Db.prototype.getAmperInterval = function (house_id, datefrom, dateto, _callback) {

	// Amper.find({ 'amperdate': { '$gte': datefrom, '$lt': dateto } }, '-_id -__v', (error, temperatures) => {
	// 	if (error) { return _callback(null) }
	// 	return _callback(temperatures)
	// }).where('sensorid').equals(sensorid)
	Amper.find({'amperdate': { '$gte': datefrom, '$lt': dateto }}, '-_id -__v', (error, ampers) => {
		if (error) { return _callback(null) }
		return _callback(ampers)
	}).where('house_id').equals(house_id)
}

Db.prototype.createAmperMessage = function (hid,tv,td,_callback){
	var self = this
	
	// create a Temperature json object 
	var t = new Amper({  
		house_id : hid,
		ampervalue : tv,
		amperdate :  td
	})
	// call the Temperature class save operator 
	t.save(function(err) {
		if (err) 
			return _callback(err)
	})
	return _callback(null)
}


/** 
 * get DeviceSetting  
 */
Db.prototype.getDeviceSetting = function (house_id, _callback) {

	DeviceSetting.find({}, '-_id -__v', (error, ampers) => {
		if (error) { return _callback(null) }
		return _callback(ampers)
	}).where('house_id').equals(house_id)
}

Db.prototype.createDeviceSettingMessage = function (hid,n,icid,v,vd,_callback){
	var self = this
	
	// create a Temperature json object 
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


Db.prototype.deleteDeviceSettingMessage = function (hid,v,_callback){
	var self = this
	
	// create a Temperature json object 
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

Db.prototype.getHouses = function (_callback) {

	House.find({}, '-_id -__v', (error, houses) => {
		if (error) { return _callback(null) }
		return _callback(houses)
	}) //.where('house_id').equals(house_id)  
}


Db.prototype.getUserHouses = function (user_email,_callback) {

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

Db.prototype.createHouseMessage = function (hname,hid,passwd,_callback){
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

Db.prototype.getHousesByName = function (hname,_callback){
	var self = this
	
	House.find({ "house_name": { "$regex": hname, "$options": "i" } }, '-_id -__v', (error, houses) => {
		if (error) { return _callback(null) }
		return _callback(houses)
	})
}


Db.prototype.getHousesById = function (hid ,_callback){
	var self = this
	console.log("----",hid)
	House.find( {"$where": "function() { return this.house_id.toString().match(/"+hid+"/) != null; }"}, '-_id -__v', (error, houses) => {
		if (error) { return _callback(null) }
		return _callback(houses)
	})
}

Db.prototype.updateHouseMessage = function (hid,hname,passwd,_callback){
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
			doc.save()
		}
	});
	
	return _callback(null)
}

Db.prototype.createUserMessage = function (u_email,passwd,_callback){
	var self = this
	
	// create a Temperature json object 
	var t = new User({  
		user_email : u_email,
		password : passwd
	})
	
	User.findOne({ user_email: u_email }, function (err, doc){	
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

Db.prototype.LoginUser = function (u_email,passwd,_callback){
	var self = this
	
	User.findOne({ user_email: u_email,password : passwd }, function (err, doc){	
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

Db.prototype.LoginSmartWatch = function (smartwatch_id,_callback){
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

Db.prototype.getSmartWatchUser = function (smartwatch_id,_callback){
	var self = this
	
	UserSmartWatch.find({ smartwatch_id: smartwatch_id }, '-_id -__v -smartwatch_id', (error, users) => {
		if (error) { return _callback(null) }
		return _callback(users)
	})
}

Db.prototype.getUserSmartWatch = function (user_email,_callback){
	var self = this
	
	UserSmartWatch.find({ user_email: user_email }, '-_id -__v -user_email', (error, users) => {
		if (error) { return _callback(null) }
		return _callback(users)
	})
}

Db.prototype.createUserHouseMessage = function (u_email,h_id,_callback){
	var self = this
	
	// create a Temperature json object 
	var t = new UserHouse({  
		user_email : u_email,
		house_id : h_id
	})
	
	User.findOne({user_email:u_email},function(err, doc) {
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

Db.prototype.createUserSmartWatchMessage = function (user_email,smartwatch_id,_callback){
	var self = this
	
	// create a Temperature json object 
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
	
Db.prototype.deleteUserHouse = function (u_email,h_id,_callback){
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



