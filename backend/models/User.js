'use strict'

let mongoose = require('mongoose'),
	Schema = mongoose.Schema

let userSchema = new Schema({
	user_email : String,
	password : String,
	phone_number : String
})

module.exports = mongoose.model('Users', userSchema)
