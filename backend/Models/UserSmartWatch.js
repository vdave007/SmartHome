'use strict'

let mongoose = require('mongoose'),
	Schema = mongoose.Schema

let usersmartwatchSchema = new Schema({
	user_email : String,
	smartwatch_id : Number
})

module.exports = mongoose.model('usersmartwatches', usersmartwatchSchema)
