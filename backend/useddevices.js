
var UsedDevices = module.exports = function () {
	this.init()
}

UsedDevices.prototype.init = function() {
	this.devices = []
	this.totalConsuption=0
}

UsedDevices.prototype.addDevice = function(consumption) {
	this.totalConsuption = this.totalConsuption + parseInt(consumption)
	this.devices.push(consumption)
}

UsedDevices.prototype.removeDevice = function(consumption) {
	this.totalConsuption = this.totalConsuption - parseInt(consumption)
	var index = this.devices.indexOf(consumption)
	if(index>-1){
		this.devices.splice(index,1)
	}
}