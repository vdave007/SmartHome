'use strict'

let valueCountsAsSpikeUnder = 8;
let maximumDiffBetweenSpikes = 3;

var UsedDevices = module.exports = function () {
	this.init()
}

UsedDevices.prototype.init = function() {
	this.setDevicesToNull()
}

UsedDevices.prototype.addDevice = function(consumption) {
	if(consumption < valueCountsAsSpikeUnder){
		return
	}
	this.totalConsuption = this.totalConsuption + parseInt(consumption)
	this.devices.push(consumption)
	this.numberOfDevices = this.numberOfDevices + 1
	var sum = this.getDevicesSum()
	if(sum > this.totalConsuption){
		this.devices.pop()
	}
}

UsedDevices.prototype.removeDevice = function(consumption) {
	var closestDiff = 9999999;
	var closestIndex = -1;
	if(consumption < valueCountsAsSpikeUnder){
		return
	}
	if(this.totalConsuption <= 0){
		this.setDevicesToNull()
		return
	}
	if(consumption > this.totalConsuption){
		this.setDevicesToNull()
		return
	}
	for(var i=0; i<this.numberOfDevices; i++){
		if(Math.abs(this.devices[i] - consumption) < closestDiff){
			closestDiff = Math.abs(this.devices[i] - consumption)
			closestIndex = i
		}
		if(this.devices[i] == consumption){ // In case if the stopped device exists
			this.removeAtIndex(i)
			return
		}
	}
	if(consumption > valueCountsAsSpikeUnder)//Remove the closest if its not a spike
	{
		this.removeAtIndex(closestIndex)
		return
	}
	console.warn('Could not find the stoped device!')

}

UsedDevices.prototype.setDevicesToNull = function(){
	this.devices = []
	this.totalConsuption = 0
	this.numberOfDevices = 0
}

UsedDevices.prototype.getDevicesSum = function(){
	var sum = 0
	for(var i=0; i<this.numberOfDevices; i++){
		sum = sum + this.devices[i]
	}
	console.log('SUM IS -', sum)
	return sum
}

UsedDevices.prototype.removeAtIndex = function(index){
	if (index < 0)
	{
		return
	}
	this.totalConsuption = this.totalConsuption - this.devices[index]
	this.numberOfDevices = this.numberOfDevices - 1
	this.devices.splice(index,1)
	if(this.totalConsuption == NaN || this.totalConsuption == 0 || this.numberOfDevices < 0){
		this.setDevicesToNull()
	}
}

UsedDevices.prototype.getWorkingDevices = function(){
	return [this.numberOfDevices,this.devices]
}