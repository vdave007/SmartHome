//+12512202536 twilio

var accountSid = 'AC5cacd8b5854e651510df4b9c332484e5'; 
var authToken = '03176e053ffcb0a9d3d9c9518cdb38c3'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

const Sms = module.exports = function () {
}
 

Sms.prototype.sendSms = function(to,message)
{
    client.messages.create({ 
        to:   "+4"+to, 
        from: "+12512202536", 
        body: "Reset Code: "+message}, function(err, message) { 
        console.log(message.sid); 
    });
}