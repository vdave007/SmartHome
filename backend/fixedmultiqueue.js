const FIXEDQUEUE_SIZE = 5

var FixedMultiQueue = module.exports = function (size) {
	this.init(size)
}

FixedMultiQueue.prototype.init = function(size) {
    this.numberOfQueues = size;
    this.data = []    
    for(var i=0; i<this.numberOfQueues; i++){
        this.data[i] = Array(FIXEDQUEUE_SIZE)
        var initWithZero = this.data[i]
        for(var j=0;j<FIXEDQUEUE_SIZE;j++){
            initWithZero[j] = 0
        }
    }
}


FixedMultiQueue.prototype.getData = function() {
    return this.data;
}

FixedMultiQueue.prototype.getDataAtIndex = function (index) {
    return this.data[index];
}

FixedMultiQueue.prototype.pushInObjectInOrder = function (object){
    if(this.data.length != object.length){
        console.warn('PushInObject size differs!')
        return
    }
    for(var i=0; i<this.numberOfQueues; i++){
        this.data[i].pop()
        this.data[i].unshift(object[i])
    }
}

FixedMultiQueue.prototype.getLatestDataObject = function (){
    var obj = [];
    for(var i=0; i<this.numberOfQueues; i++){
        obj[i] = this.data[i][0]
    }
    return obj
}

FixedMultiQueue.prototype.pushInQueueIndex = function (index,value)
{
    if(this.data[index] == undefined){
        return undefined
    }
    this.data[index].pop()
    return this.data[index].unshift(value)
}