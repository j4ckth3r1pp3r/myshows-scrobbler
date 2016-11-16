'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('phoneList').
  component('phoneList', {
    templateUrl: 'phone-list/phone-list.template.html',
    controller: ['Phone', '$http',
      function PhoneListController(Phone, $http) {
        var self = this;
        this.phones = Phone.query();
        this.orderProp = 'age';
        this.testhtml = '<b>lol</b>';
        this.test = $http({
              method: 'POST',
              url: 'https://api.myshows.me/v2/rpc/',
              data: JSON.stringify({
                'jsonrpc': "2.0",
                'method': "shows.GetById",
                'params': {
                  'showId': 2,
                  'withEpisodes': true
                },
                'id': 1
              }),
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer 859ea2450228a5d655e3a8c2f9a5aedc30b591df',
              }
            }).success(function (data) {
              console.log(data.result);
            });
      }
    ]
  });
