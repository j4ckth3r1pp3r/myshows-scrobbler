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
        otherwise('/');
    }
  ]);
