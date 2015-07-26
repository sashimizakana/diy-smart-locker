var EventEmitter = require('events').EventEmitter;

function Lock(){
	this.initialize.apply(this,arguments);
}

Lock.prototype = {
    initialize:function(gpio){
        this.gpio = gpio;
        this.state = "initialize";
        this.emitter = new EventEmitter();
    }
    ,attach:function(config,callback){
        this.config = config;

        console.log(config);

        this.gpio.close(config.motor1);
        this.gpio.close(config.motor2);
        this.gpio.close(config.inA);
        this.gpio.close(config.inB);
        this.gpio.close(config.outA);
        this.gpio.close(config.outB);
        console.log('closed pins');
        var self = this;
        setTimeout(function(){
            console.log('open pins');
            self.readPort(config.inA,'inA',self.emitter);
            self.readPort(config.inB,'inB',self.emitter);
            self.readPort(config.outA,'outA',self.emitter);
            self.readPort(config.outB,'outB',self.emitter);
            self.gpio.open(config.motor1,"output");
            self.gpio.open(config.motor2,"output");
            self.beginWatcher(self.emitter);
            callback();
        },300);
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
        if(this.isOpened()){
            return;
        }
        this.toOpen();
    }
    ,on:function(eventName,callback){
        this.emitter.on(eventName,callback);
    }
    ,neutral:function(){
        this.state = "toNeutral";
        if(this.isNeutral()){
            return;
        }
        if(this.isOpened()){
            console.log('opened to neutral');
            this.openedToNeutral();
        }else{
            console.log('locked to neutral');
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
        var self = this;
        this.stopMotor();
        setTimeout(function(){
            self.turnRight();
        },300);
    }
    ,lockedToNeutral:function(){
        var self = this;
        this.stopMotor();
        setTimeout(function(){    
            self.turnLeft();
        },300);
    }
    ,isOpened:function(){
        return this.inB || false;
    }
    ,isLocked:function(){
        return this.inA || false;
    }
    ,isNeutral:function(){
        return this.outA && this.outB || false;
    }
    ,turnRight:function(){
        console.log('turnRight');
        this.gpio.write(this.config.motor1,0);
        this.gpio.write(this.config.motor2,1);
    }
    ,turnLeft:function(){
        console.log('turnLeft');
        this.gpio.write(this.config.motor1,1);
        this.gpio.write(this.config.motor2,0);
    }
    ,stopMotor:function(){
        console.log('stopMotor');
        this.gpio.write(this.config.motor1,0);
        this.gpio.write(this.config.motor2,0);
    }
    ,beginWatcher:function(emitter){
        var self = this;
        emitter.on("onRead",function(){
            console.log(self.state,'Lock:'+self.isLocked(),'Open:'+self.isOpened(),'Neutral:'+self.isNeutral());
            if(self.state == "toLock" && self.isLocked()){
                self.emitter.emit('stateChanged','lock to neutral');
                self.neutral();
            }else if(self.state == "toOpen" && self.isOpened()){
                self.emitter.emit('stateChanged','open to neutral');
                self.neutral();
            }else if(self.state == "toNeutral" && self.isNeutral()){
                self.state = 'neutral';
                self.emitter.emit('stateChanged','neutral to wait');
                self.stopMotor();
           }
        });
    }
    ,readPort:function(pin,prop,emitter){
        var self = this;
        this.gpio.open(pin,"input pullup",function(){
            setInterval(function(){
                self.gpio.read(pin,function(e,v){
                    self[prop] = v ? false : true;
                    emitter.emit('onRead');
                });
            },10);
        });
    }
}

module.exports = Lock;
