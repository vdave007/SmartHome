'use strict'

let valueCountsAsSpikeUnder = 10;
let maximumDiffBetweenSpikes = 3;

var UsedDevices = module.exports = function () {
	this.init()
}

UsedDevices.prototype.init = function() {
	this.setDevicesToNull()
}

UsedDevices.prototype.addDevice = function(consumption) {
	if(consumption < valueCountsAsSpikeUnder/2){
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
	var closestDiff = 50;
	var closestIndex = 0;
	if(this.totalConsuption <= 0){
		this.setDevicesToNull()
		return
	}
	if(consumption > this.totalConsuption){
		this.setDevicesToNull()
	}
	for(var i=0; i<this.numberOfDevices; i++){
		if(this.devices[i] - consumption < closestDiff){
			closestDiff = this.devices[i] - consumption
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
	else{ // Remove the closest spike if the difference is not too big
		if(closestDiff <= maximumDiffBetweenSpikes){
			this.removeAtIndex(closestIndex)
			return
		}
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
	this.totalConsuption = this.totalConsuption - this.devices[index]
	this.numberOfDevices = this.numberOfDevices - 1
	this.devices.splice(index,1)
	if(this.totalConsuption = NaN || this.totalConsuption == 0 || this.numberOfDevices < 0){
		this.setDevicesToNull()
	}
}

UsedDevices.prototype.getWorkingDevices = function(){
	return [this.numberOfDevices,this.devices]
}