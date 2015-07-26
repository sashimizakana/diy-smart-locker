var pi = require('pi-gpio');
var port1 = 11;
var port2 = 13;
var ready1 = false;
var ready2 = false;

pi.close(port1);
pi.close(port2);

setTimeout(function(){
    pi.open(port1,"output",function(){
        ready1 = true;
    });
    pi.open(port2,"output",function(){
        ready2 = true;
    });
},100);

var left = false;
setInterval(function(){
    if(ready1 && ready2){
        console.log('morot toggle');
        pi.write(port1,left ? 1 : 0);
        pi.write(port2,left ? 0 : 1);
        left = !left;
    }
},5000);
