'use strict';

angular.
  module('main').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/', {
          template: '<main/>'
        }).
        when('/auth/:authCode', {
          template: '<auth/>'
        }).
        when('/index', {
          template: '<index/>'
        }).
        when('/settings', {
          template: '<settings/>'
        }).
        otherwise('/');
    }
  ]);
