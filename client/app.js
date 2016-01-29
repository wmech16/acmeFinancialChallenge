angular.module('acme', ['ui.router','ngCookies']).config(function($stateProvider, $urlRouterProvider, $httpProvider){

        $urlRouterProvider.otherwise('/');

        $httpProvider.interceptors.push('httpServiceInterceptor');

        $stateProvider

            .state('/', {
                url: '/',
                controller: 'mainCtrl',
                templateUrl: './views/login.html'
            })

            .state('profile',{
                url: '/profile',
                controller: 'mainCtrl',
                templateUrl: './views/profile.html',
                resolve : {
                    authenticate : authenticate
                }
            })

            .state('edit',{
                url: '/edit',
                controller: 'mainCtrl',
                templateUrl: './views/edit.html',
                resolve : {
                    authenticate : authenticate
                }
            });


        authenticate.$inject = ['$q', '$cookies', '$rootScope'];
        function authenticate($q, $cookies, $rootScope) {
            if ($cookies.get('token')) {
                return $q.when({authenticated: true});
            }
            else {
                $rootScope.loginError = "Please Log In to Continue";
                return $q.reject({authenticated: false})
            }
        }
    })
