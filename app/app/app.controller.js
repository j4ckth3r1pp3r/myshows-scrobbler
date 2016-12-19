mainApp.
    component('main', {
      templateUrl: 'main.template.html',
      controller: function (windowTitle, authInfo, $location, msrequest, $http) {
        var self = this;
        self.title = windowTitle;
        self.authInfo = authInfo;
        self.title.name = 'MScrobbler (Не авторизирован)';
        self.authInfoDeprecated = false;
        self.isLoaded = false;
        self.noInternet = false;

        msrequest.get('profile.Get', {}).then((r) => {
          $location.path('/index');
        }, (error) => {
          self.refreshToken();
        });

        self.refreshToken = () => {
          self.noInternet = false;
          let refreshTokenKey = localStorage.getItem('refresh_token');
          $http({
                method: 'POST',
                url: 'https://myshows.me/oauth/token',
                data: `grant_type=refresh_token&client_id=${self.authInfo.options.client_id}&client_secret=${self.authInfo.options.client_secret}&refresh_token=`+refreshTokenKey+`&redirect_uri=${self.authInfo.options.redirect_uri}`,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/json',
                }
              }).then((r) => {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                $location.path('/index');
              }, (error) => {
                  if (error.status === 400) {
                    self.isLoaded = true;
                    if (localStorage.getItem('access_token') && localStorage.getItem('refresh_token')) {
                      self.authInfoDeprecated = true;
                      localStorage.removeItem('access_token');
                      localStorage.removeItem('refresh_token');
                    }
                  }
                  else if (error.status === -1) self.noInternet = true;
              });
        }


        self.openAuthWindow = function openAuthWindow () {

          var myShowsUrl = 'https://myshows.me/oauth/authorize?response_type=code&';
          var authUrl = myShowsUrl + 'client_id=' + self.authInfo.options.client_id + '&scope=' + self.authInfo.options.scopes + '&redirect_uri=' + self.authInfo.options.redirect_uri;

          ipcRenderer.send('createAuthWindow', authUrl);
        }

      }
    });
