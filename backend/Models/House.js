'use strict'

let mongoose = require('mongoose'),
	Schema = mongoose.Schema

let houseSchema = new Schema({
	house_id : Number,
	house_name : String,
	password : String
})

module.exports = mongoose.model('Houses', houseSchema)
