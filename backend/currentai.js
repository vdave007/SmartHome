"use strict"

let FixedMultiQueue = require ('./fixedmultiqueue')
let UsedDevices = require ('./useddevices')
let deltaDecisionValue = 0
let nullContinousValue = 2

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
    // console.log(this.currentValues[deviceID])
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

CurrentAI.prototype.getCurrentlyWorkingDevicesJSON = function(deviceID,currentDate){
    if(this.workingDevices[deviceID] == undefined){
        return undefined
    }
    var currentlyWorkingDevices = this.workingDevices[deviceID][0].getWorkingDevices()
    var response = new Object()
    response.deviceID = deviceID
    response.WattConsumption = []
    response.WattConsumption.push(this.workingDevices[deviceID][0].getWorkingDevices()[1])
    response.WattConsumption.push(this.workingDevices[deviceID][1].getWorkingDevices()[1])
    response.WattConsumption.push(this.workingDevices[deviceID][2].getWorkingDevices()[1])
    response.WattConsumption.push(this.workingDevices[deviceID][3].getWorkingDevices()[1])
    response.date = currentDate    
    return response 

}

CurrentAI.prototype.decideWorkingDevices = function(deviceID,circuitNumber,listOfLastMeasurements){    
    console.log(listOfLastMeasurements, this.workingDevices[deviceID][circuitNumber])
    var isNull = true;
    for(var i=0; i<nullContinousValue; i++){
        if(listOfLastMeasurements[i]!=0){
            isNull = false
        }
    }
    if(isNull){
        this.workingDevices[deviceID][circuitNumber].setDevicesToNull()
    }

    if(listOfLastMeasurements[0]!=listOfLastMeasurements[1]){
        if(listOfLastMeasurements[0] == listOfLastMeasurements[2]){ //Skip a beat, could be spike
            return
        }
        var calculatedValue = parseInt(listOfLastMeasurements[0])-parseInt(listOfLastMeasurements[1])
        if(parseInt(listOfLastMeasurements[0])-parseInt(listOfLastMeasurements[1]) > deltaDecisionValue){    
            console.log('\x1b[32m%s\x1b[0m','NEW DEVICE DETECTED - ', calculatedValue)
            this.workingDevices[deviceID][circuitNumber].addDevice(calculatedValue)

        }
        else{
            console.log('\x1b[31m%s\x1b[0m','DEVICE STOPPED - ', calculatedValue)
            this.workingDevices[deviceID][circuitNumber].removeDevice(-calculatedValue)
        }
        console.log(this.workingDevices[deviceID]) 
    }
}