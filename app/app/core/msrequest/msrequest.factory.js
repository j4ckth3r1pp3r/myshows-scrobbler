msrequestModule.
  factory('msrequest', function($http, $q) {
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
                }).then(response => response.data.error ? $q.reject(response.data.error) : $q.resolve(response));

      },
      getPage: function (url) {
        return $http.post(url);
      },
      getSerialNameMPC: function (port) {
        return $http.post(`http://localhost:${port}/status.html`).then(response => response.data.error ? $q.reject(response.data.error) : $q.resolve(response.data.match(/tus\(\"(.*?)\"/)[1]));
      },
    };
  });
