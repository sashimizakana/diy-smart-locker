var Lock = require('lib/lock.js');
var gpio = require('pi-gpio');

var lock = new Lock(gpio);
lock.attach({
	inA:3
	,inB:5
	,outA:7
	,outB:24
	,motor1:17
	,motor2:27
});

lock.lock();
lock.on('stateChanged',function(){
    console.log(lock.state);
});
