var myApp = angular.module('myApp', []);

myApp.controller('signupCtrl', function ($scope, $http) {

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
    }).success(function(data, status, headers, config) {
      location.href = '/';
      $scope.reqInProgress = false;
    }).error(function(data, status, headers, config) {
      $scope.registerError = 'Error: ' + data.error;
      $scope.reqInProgress = false;
    });
  };
});

myApp.controller('signinCtrl', function ($scope, $http) {

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
    }).success(function(data, status, headers, config) {
      location.href = '/dashboard';
      $scope.reqInProgress = false;
    }).error(function(data, status, headers, config) {
      $scope.loginError = 'Error: ' + data.error;
      $scope.reqInProgress = false;
    });
  };
});
