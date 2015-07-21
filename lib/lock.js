
function Lock(){
	this.initialize.apply(this,arguments);
}

Lock.prototype = {
	initialize:function(gpio){
		this.gpio = gpio;
	}
	,attach:function(config){
		this.config = config;
	}
	,getState:function(){
		
	}
}
