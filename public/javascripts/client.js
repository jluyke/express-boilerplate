var myApp = angular.module('myApp', ['ngCookies'])
    .config(function($cookiesProvider) {
        $cookiesProvider.defaults.path = '/';
        $cookiesProvider.defaults.secure = location.protocol === 'https:';
    });

myApp.controller('signupCtrl', function ($scope, $http, $cookies) {

    $scope.init = function(){
        $scope.registerForm = {};
    };

    $scope.register = function(){
        if($scope.reqInProgress) return;
        $scope.reqInProgress = true;
        $http({
            method: 'POST',
            url: '/ajax/register',
            data: $scope.registerForm
        }).then(function(response) {
            $cookies.put('sessionId', response.data.sessionId);
            location.href = '/';
        }, function(response) {
            $scope.registerError = 'Error: ' + response.data.message;
            $scope.reqInProgress = false;
        });
    };
});

myApp.controller('signinCtrl', function ($scope, $http, $cookies) {

    $scope.init = function(){
        $scope.loginForm = {};
    };

    $scope.login = function(){
        if($scope.reqInProgress) return;
        $scope.reqInProgress = true;
        $http({
            method: 'POST',
            url: '/ajax/login',
            data: $scope.loginForm
        }).then(function(response) {
            $cookies.put('sessionId', response.data.sessionId);
            $cookies.put('accountId', response.data.accountId);
            location.href = '/dashboard';
        }, function(response) {
            $scope.loginError = 'Error: ' + response.data.message;
            $scope.reqInProgress = false;
        });
    };
});
