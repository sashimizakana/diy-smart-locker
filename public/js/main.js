function mainCtrl(Lock,$timeout){
    var vm = this;
    vm.lock = new Lock();

    var checkState = function(){
        vm.lock.getState();
        $timeout(checkState,2000);
    };

    checkState();
}
function main(){
    return {
        scope:true
        ,controller:mainCtrl
        ,controllerAs:"ctrl"
        ,templateUrl:"/js/tpl/main.html"
    }
}

var app = angular.module('app',['lock']);
app.directive('main',main);
angular.element(document).ready(function(){
    angular.bootstrap(document, ['app']);
});
