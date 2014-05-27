
// Declare app level module which depends on filters, and services
angular.module('myNatiApp', [
  'ngRoute',
  'angular-gestures',
  'myNatiApp.filters',
  'myNatiApp.services',
  'myNatiApp.directives',
  'myNatiApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/help', {templateUrl: 'partials/help.html', controller: 'CtrlHelp'});
  $routeProvider.when('/disk', {templateUrl: 'partials/disk.html', controller: 'CtrlDisk'});
  $routeProvider.otherwise({redirectTo: '/disk'});
}]);
