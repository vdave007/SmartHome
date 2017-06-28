"use strict"

let FixedMultiQueue = require ('./fixedmultiqueue')
let UsedDevices = require ('./useddevices')
let deltaDecisionValue = 0

/*
Artificial Intelligence for deciding which devices are in use.
All stored values are in W (Watt) and not in Ampers. This conversion must be done before using the addValues method.
*/
var CurrentAI = module.exports = function(){
    this.init()
}

CurrentAI.prototype.init = function(){
    this.currentValues = [];
    this.workingDevices = [];
}

CurrentAI.prototype.addValues = function(deviceID,v1,v2,v3,v4){
    if(this.currentValues[deviceID]==undefined)
    {
        this.currentValues[deviceID] = new FixedMultiQueue(4)
        this.workingDevices[deviceID] = [new UsedDevices(),new UsedDevices(),new UsedDevices(),new UsedDevices()]
    }
    console.log(this.currentValues[deviceID])
    this.currentValues[deviceID].pushInObjectInOrder([v1,v2,v3,v4])
    this.decideWorkingDevices(deviceID,0,this.currentValues[deviceID].getDataAtIndex(0))
    this.decideWorkingDevices(deviceID,1,this.currentValues[deviceID].getDataAtIndex(1))
    this.decideWorkingDevices(deviceID,2,this.currentValues[deviceID].getDataAtIndex(2))
    this.decideWorkingDevices(deviceID,3,this.currentValues[deviceID].getDataAtIndex(3))
}

CurrentAI.prototype.getValues = function(deviceID){
    return this.currentValues[deviceID]
}

CurrentAI.prototype.getLatestValues = function(deviceID){
    return this.currentValues[deviceID].getLatestDataObject()
}

CurrentAI.prototype.decideWorkingDevices = function(deviceID,circuitNumber,listOfLastMeasurements){    
    console.log(listOfLastMeasurements)

    if(listOfLastMeasurements[0]!=listOfLastMeasurements[1]){
        var calculatedValue = parseInt(listOfLastMeasurements[0])-parseInt(listOfLastMeasurements[1])
        if(parseInt(listOfLastMeasurements[0])-parseInt(listOfLastMeasurements[1]) > deltaDecisionValue){    
            console.log('NEW DEVICE DETECTED - ', calculatedValue)
            this.workingDevices[deviceID][circuitNumber].addDevice(calculatedValue)

        }
        else{
            console.log('DEVICE STOPPED - ', calculatedValue)
            this.workingDevices[deviceID][circuitNumber].removeDevice(-calculatedValue)
        }
        console.log(this.workingDevices[deviceID]) 
    }
}