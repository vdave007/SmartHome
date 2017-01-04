'use strict'

let mongoose = require('mongoose'),
	Schema = mongoose.Schema

let rawDataSchema = new Schema({
	controllerId : String,
	v1 : String,
	v2 : String,
	v3 : String,
	v4 : String
})

module.exports = mongoose.model('RawData', rawDataSchema)
