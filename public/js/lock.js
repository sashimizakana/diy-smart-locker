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
                self.state = result.data.state;
                return self;
            });
        }
        ,isLockable:function(){
            return this.state == "opened" || this.state == "neutral" || this.state == "initialize";
        }
        ,isOpenable:function(){
            return this.state == "locked" || this.state == "neutral" || this.state == "initialize";
        }
        ,open:function(){
            return this.change('open');
        }
        ,lock:function(){
            return this.change('lock');
        }
        ,change:function(param){
            var self = this;
            return $http.post('/lock',{state:param}).then(function(result){
                self.state = result.data.state;
            })          
        }
    }   
    return Lock;
}

lock.factory('Lock',LockFactory);

function lockStateCtrl(){
    console.log(this);
}

function lockState(){
    return {
        scope:{}
        ,templateUrl:"/js/tpl/lock-state.html"
        ,controller:lockStateCtrl
        ,controllerAs:"ctrl"
        ,bindToController:{
            lock:'=lock'
        }
    }
}

lock.directive('lockState',lockState);

function lockControlCtrl(){}

function lockControl(){
    return {
        scope:{}
        ,templateUrl:"/js/tpl/lock-control.html"
        ,controller:lockControlCtrl
        ,controllerAs:"ctrl"
        ,bindToController:{
            lock:'=lock'
        }
    }
}

lock.directive('lockControl',lockControl);
