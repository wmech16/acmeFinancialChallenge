(function(){
    'use strict';

    angular.module('acme')
        .run(run);

    run.$inject = ['$rootScope', '$cookies', 'mainService'];

    function run($rootScope, $cookies, mainService){
        if($cookies.get('token')){
            $rootScope.user = jwt_decode($cookies.get('token'));

        }
    }

})();