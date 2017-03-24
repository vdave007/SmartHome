'use strict'

let mongoose = require('mongoose'),
	Schema = mongoose.Schema

let deviceSetting = new Schema({
	house_id : Number,
    name : String,
	icon_id : Number,
	value : Number,
    valuedelay : Number
})

module.exports = mongoose.model('DeviceSettings', deviceSetting)
