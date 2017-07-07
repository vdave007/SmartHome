'use strict'

let mongoose = require('mongoose'),
	Schema = mongoose.Schema

let resetpasswordSchema = new Schema({
	user_email : String,
	reset_code : String,
	expire : Number
})

module.exports = mongoose.model('ResetPassword', resetpasswordSchema)
