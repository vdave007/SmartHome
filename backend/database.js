let mongoose = require('mongoose'),
	path = require('path'),
	RawData = require(path.resolve('./backend/models/rawdata.js'))

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

	self.mongoose.connect('mongodb://localhost/smartHome',
		function(err) { 
			if (err) console.error('error:' + err)
		 })
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