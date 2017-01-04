'use strict'

let mongoose = require('mongoose'),
	Schema = mongoose.Schema

let rawDataSchema = new Schema({
	controllerId : String,
	time   : String,
	value1 : String,
	value2 : String,
	value3 : String,
	value4 : String
})

module.exports = mongoose.model('RawData', rawDataSchema)
