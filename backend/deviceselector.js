'use strict'

var DeviceSelector = module.exports = function(dataBase){
    this.init(dataBase)
}

DeviceSelector.prototype.init = function(dataBase){
this.dataBase = dataBase
}

DeviceSelector.prototype.asyncGetActualDevicesWithSettings = function(responseJson,house_id,_callback){
	this.dataBase.getDeviceSetting(house_id,function(returndatadevice){
		if (returndatadevice != null){
			var ds = []
			responseJson.forEach(function(actualdevice) {
			if (actualdevice.ampervalue != 0){	
				var find = false;
				returndatadevice.forEach(function(saveddevice) {
					
					if (saveddevice.value - saveddevice.valuedelay <= actualdevice.ampervalue 
					&& saveddevice.value + saveddevice.valuedelay >= actualdevice.ampervalue){
						find = true;
						saveddevice.original_value = parseInt(saveddevice.value)
						var data = {  
							house_id : house_id,
							name : saveddevice.name,
							icon_id : saveddevice.icon_id,
							value : parseInt(actualdevice.ampervalue),
							original_value : parseInt(saveddevice.value),
							valuedelay : saveddevice.valuedelay
						}
						ds.push(data)
					}
				},this)
				if (!find)
				{
					var data = {  
						house_id : house_id,
						name : "Unknown",
						icon_id : 0,
						value : parseInt(actualdevice.ampervalue),
						original_value : parseInt(actualdevice.ampervalue),
						valuedelay : 1
					}
					ds.push(data)
				}
			}	
		}, this);
		return _callback(ds);
		}	
	})
}
	
DeviceSelector.prototype.asyncGetActualDevicesWithSettings_New = function(responseJson,house_id,_callback){
	this.dataBase.getDeviceSetting(house_id,function(returndatadevice){
		if (returndatadevice != null){
			var ds = []
			if(responseJson != undefined){
				responseJson.WattConsumption.forEach(function(workinddevices) {
					workinddevices.forEach(function(ampervalue){
						if (ampervalue != 0){	
							var find = false;
							returndatadevice.forEach(function(saveddevice) {
								
								if (saveddevice.value - saveddevice.valuedelay <= ampervalue 
								&& saveddevice.value + saveddevice.valuedelay >= ampervalue){
									find = true;
									saveddevice.original_value = parseInt(saveddevice.value)
									var data = {  
										house_id : house_id,
										name : saveddevice.name,
										icon_id : saveddevice.icon_id,
										value : parseInt(ampervalue),
										original_value : parseInt(saveddevice.value),
										valuedelay : saveddevice.valuedelay
									}
									ds.push(data)
								}
							},this)
							if (!find)
							{
								var data = {  
									house_id : house_id,
									name : "Unknown",
									icon_id : 0,
									value : parseInt(ampervalue),
									original_value : parseInt(ampervalue),
									valuedelay : 1
								}
								ds.push(data)
							}
						}	
					},this);
				}, this);
			}
		return _callback(ds);
		}	
	})
}
