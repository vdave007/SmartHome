'use strict'

let mongoose = require('mongoose'),
	Schema = mongoose.Schema

let amperSchema = new Schema({
	house_id : String,
	ampervalue : Number,
	amperdate : Number
})

module.exports = mongoose.model('Ampers', amperSchema)
