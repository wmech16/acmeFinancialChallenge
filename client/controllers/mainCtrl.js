angular.module('acme').controller('mainCtrl', mainCtrl);

    mainCtrl.$inject=[
        '$scope',
        '$state',
        '$rootScope',
        '$cookies',
        'mainService',
        '$http'
    ];

function mainCtrl($scope, $state, $rootScope,  $cookies, mainService, $http) {
    $scope.first = null;
    $scope.address = null;
    $scope.phone = null;
    $scope.last = null;
    if(!$scope.name){
        $scope.name = null;
    }
    if(!$scope.email){
        $scope.email = null;
    }
    if(!$scope.password){
        $scope.password = null;
    }


    $scope.login = function(){


        var payload = { email :$scope.email , password : $scope.password } ;
        mainService.login('/login', payload).then(function(data){
            if(data.errorMessage) {
                $rootScope.errorBody = data;
            }
            else {
                $http.get('/api/verify').then(function(res) {
                    if(data.error) {
                        $scope.errorBody = data;
                    }
                    else {
                        $state.go(res.data.redirect);
                    }
                })
            }


        })
    };

    $scope.logout = function(){
        mainService.logout().then(function(){
            $state.go('/');
            });
    };

    $scope.edit = function(){
        var payload = $rootScope.user;
        $http.post('/api/edit',payload).then(function(res){
            $state.go(res.data.redirect || 'profile');
        })

    }

}