var Lock = require('./lib/lock.js');
var gpio = require('pi-gpio');

var lock = new Lock(gpio);
lock.attach({
    inA:3
    ,inB:5
    ,outA:7
    ,outB:24
    ,motor1:11
    ,motor2:13
},function(){
    setTimeout(function(){
        console.log('lock start');
        lock.open();
        lock.on('stateChanged',function(message){
            console.log(lock.state,message);
        });
    },500);
});
