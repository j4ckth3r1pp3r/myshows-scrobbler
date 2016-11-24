'use strict';

angular.
  module('main').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/', {
          template: '<main></main>'
        }).
        when('/auth/:authCode', {
          template: '<h1>kek</h1>'
        }).
        otherwise('/');
    }
  ]);
