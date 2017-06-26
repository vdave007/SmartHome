"use strict"

let FixedMultiQueue = require ('./fixedmultiqueue')

/*
Artificial Intelligence for deciding which devices are in use.
All stored values are in W (Watt) and not in Ampers. This conversion must be done before using the addValues method.
*/
var CurrentAI = module.exports = function(){
    this.init()
}

CurrentAI.prototype.init = function(){
    this.currentValues = [];
}

CurrentAI.prototype.addValues = function(deviceID,v1,v2,v3,v4){
    if(this.currentValues[deviceID]==undefined)
    {
        this.currentValues[deviceID] = new FixedMultiQueue(4)
    }
    this.currentValues[deviceID].pushInObjectInOrder([v1,v2,v3,v4])
}

CurrentAI.prototype.getValues = function(deviceID){
    return this.currentValues[deviceID]
}

CurrentAI.prototype.getLatestValues = function(deviceID){
    return this.currentValues[deviceID].getLatestDataObject()
}

CurrentAI.prototype.decideWorkingDevices = function(deviceID,circuitNumber,listOfLastMeasurements){    

}