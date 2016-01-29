(function () {
    angular.module('acme').factory('httpServiceInterceptor', httpServiceInterceptor);

    httpServiceInterceptor.$inject = ['$cookieStore', '$q', '$rootScope', '$injector'];

    function httpServiceInterceptor($cookieStore, $q, $rootScope, $injector) {
        return {
            request: requestInterceptor,
            requestError: requestErrorInterceptor,
            responseError : responseErrorInterceptor
        };

        function requestInterceptor(httpConfigurationObject) {
            httpConfigurationObject.headers = httpConfigurationObject.headers || {};
            if ($cookieStore.get("token")) {
                httpConfigurationObject.headers.Authorization = 'Bearer ' + $cookieStore.get("token");
            }
            return httpConfigurationObject;
        }

        function requestErrorInterceptor(rejectionErrorObject) {
            return $q.reject(rejectionErrorObject);
        }

        function responseErrorInterceptor(rejectionErrorObject) {
            if (rejectionErrorObject.status === 401) {
                var $state = $injector.get('$state');
                $rootScope.loginError = "Session is over!";
                $cookieStore.remove("token");
                $rootScope.user = null;
                $state.go('loginSignUpPage');
            }
            return $q.reject(rejectionErrorObject);
        }
    }
})();