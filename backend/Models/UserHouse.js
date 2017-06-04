'use strict'

let mongoose = require('mongoose'),
	Schema = mongoose.Schema

let userhouseSchema = new Schema({
	user_email : String,
	house_id : String
})

module.exports = mongoose.model('UserHouses', userhouseSchema)
