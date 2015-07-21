
function Lock(){
	this.initialize.apply(this,arguments);
}

Lock.prototype = {
	initialize:function(gpio){
		this.gpio = gpio;
	}
	,attach:function(config){
		this.config = config;
		this.inA = this.setPort(config.inA,'in');
		this.inB = this.setPort(config.inB,'in');
		this.outA = this.setPort(config.outA,'in');
		this.outB = this.setPort(config.outB,'in');
		this.motor1 = this.setPort(config.motor1,'out');
		this.motor2 = this.setPort(config.motor2,'out');
	}
	,setPort:function(pin,direction){
		var port = this.gpio.export(pin,{
			direction:direction
			,ready:function(){
				if(pin == "in"){
					port.set();
				}			
			}
		});
		return port;
	}
	,getState:function(){
		
	}
}
