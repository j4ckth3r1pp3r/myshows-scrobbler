authModule.
  component('auth', {
    template: '<h1 class="text-center">Авторизируем...</p>',
    controller: function($routeParams, $http, authInfo, $location) {
      var self = this;
      self.authInfo = authInfo;
      self.authInfo.code = $routeParams.authCode;
      var dataHttp = JSON.stringify(
        {
          grant_type: 'authorization_code',
          cliend_id: self.authInfo.options.client_id,
          client_secret: self.authInfo.options.client_secret,
          code: self.authInfo.code
        }
      );

      $http({
            method: 'POST',
            url: 'https://myshows.me/oauth/token',
            data: `grant_type=authorization_code&client_id=${self.authInfo.options.client_id}&client_secret=${self.authInfo.options.client_secret}&code=${self.authInfo.code}&redirect_uri=${self.authInfo.options.redirect_uri}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            }
          }).success(function (data) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            $location.path('/index');
          });

    }
  });
