var EventEmitter = require('events').EventEmitter;

function Lock(){
	this.initialize.apply(this,arguments);
}

Lock.prototype = {
    initialize:function(gpio){
        this.gpio = gpio;
        this.state = "initialize";
	}
    ,attach:function(config){
        this.emitter = new EventEmitter();
        this.config = config;

        this.readPort(config.inA,'inA',this.emitter);
        this.readPort(config.inB,'inB',this.emitter);
        this.readPort(config.outA,'outA',this.emitter);
        this.readPort(config.outB,'outB',this.emitter);

        this.gpio.open(config.motor1,"output");
        this.gpio.open(config.motor2,"output");
        this.beginWatcher(this.emitter);
	}
    ,lock:function(){
        this.state = "toLock";
        if(this.isLocked()){
            return;
        }
        this.toLock();
    }
    ,open:function(){
        this.state = "toOpen";
        if(this.isOpen()){
            return;
        }
        this.toOpen();
    }
    ,neutral:function(){
        this.state = "toNeutral";
        if(this.isNeutral()){
            return;
        }
        if(this.isOpened()){
            this.openedToNeutral();
        }else{
            this.lockedToNeutral();
        }
    }
    ,toLock:function(){
        this.turnRight();
    }
    ,toOpen:function(){
        this.turnLeft();
    }
    ,openedToNeutral:function(){
        this.turnRight();
    }
    ,lockedToNeutral():function(){
        this.turnLeft();
    }
    ,isOpened:function(){
        return this.inA;
    }
    ,isLocked:function(){
        return this.inB;
    }
    ,isNeutral:function(){
        return this.outA && this.outB;
    }
    ,turnRight:function(){
        this.gpio.write(this.config.motor1,1);
        this.gpio.write(this.config.motor2,0);
    }
    ,turnLeft:function(){
        this.gpio.write(this.config.motor1,0);
        this.gpio.write(this.config.motor2,1);
    }
    ,stopMotor:function(){
        this.gpio.write(this.config.motor1,0);
        this.gpio.write(this.config.motor2,0);
    }
    ,beginWatcher:function(emitter){
        var self = this;
        emitter.on("onRead",function(){
           if(self.state == "toLock" && self.isLocked()){
               self.neutral();
           }else if(self.state == "toOpen" && self.isOpened()){
               self.neutral();
           }else if(self.state == "toNeutral" && self.isNeutral()){
               self.state == "neutral";
           }
        });
    }
    ,readPort:function(pin,prop,emitter){
        var self = this;
        this.gpio.open(pin,"input pullup",function(){
            setInterval(function(){
                self.gpio.read(pin,function(e,v){
                    self[pin] = v ? false : true;
                    emitter.emit('onRead');
                });
            },100);
        });
    }
}

module.exports = Lock;
