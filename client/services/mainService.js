(function () {
    angular.module('acme').service('mainService', mainService);

    mainService.$inject = [
        '$q',
        '$http',
        '$cookieStore',
        '$rootScope'
    ];

    function mainService($q, $http, $cookieStore, $rootScope) {
        var user;
        return {
            login : login,
            logout : logout
        };
       function login (url,payload){
            return $http.post(url,payload).then(function(response){
                if(response.data.errorMessage){
                    return response.data;
                }
                else{
                    $cookieStore.put("token",response.data.token);
                    $rootScope.user = jwt_decode(response.data.token);
                    return "success";
                }
            })
        }

        function logout() {
            $rootScope.user = null;
            var defer = $q.defer();
            $cookieStore.remove("token");
            $rootScope.typeOfLogin = null;
            defer.resolve();
            return defer.promise;
        }

    }
})();