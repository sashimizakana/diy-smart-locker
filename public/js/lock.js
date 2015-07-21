var lock = angular.module('lock',[]);

function LockFactory($http){
	function Lock(){
		this.initialize.apply(this,arguments);
	}
	
	Lock.prototype = {
		initialize:function(){
			this.state = null;
		}
		,getState:function(){
			var self = this;
			return $http.get('/lock').then(function(result){
				self.state = result.state;
			});
		}
		,open:function(){
			return this.change('open');
		}
		,close:function(){
			return this.change('close');
		}
		,change:function(param){
			var self = this;
			return $http.post('/lock'.{state:param).then(function(result){
				self.state = result.state;
			})			
		}
	}	
	return Lock;
}

lock.factory('Lock',LockFactory);

function lockStateCtrl(){}

function lockState(){
	return {
		scope:true
		,templateUrl:"tpl/lock-state.html"
		,controller:lockStateCtrl
		,contorllerAs:"ctrl"
		,bindToController:{
			lock:'=lock'
		}
	}
}

lock.directive('lockState',lockState);