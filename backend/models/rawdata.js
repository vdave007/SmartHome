'use strict'

let mongoose = require('mongoose'),
	Schema = mongoose.Schema

let rawDataSchema = new Schema({
	controllerId : String,
	time   : String,
	value1 : Number,
	value2 : Number,
	value3 : Number,
	value4 : Number
})

module.exports = mongoose.model('RawData', rawDataSchema)
