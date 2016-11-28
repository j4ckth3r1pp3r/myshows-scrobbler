msrequestModule.
  factory('msrequest', function($http) {
    return {
      get: function(method, params = {}) {
        return $http.post('https://api.myshows.me/v2/rpc/',
              JSON.stringify({
                'jsonrpc': "2.0",
                'method': method,
                'params': params,
                'id': 1
              }), {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': 'Bearer '+localStorage.getItem('access_token'),
                }
              });

      }
    };
  });
