mainApp.
    component('main', {
      templateUrl: 'main.template.html',
      controller: function (windowTitle, authInfo, $location) {
        var self = this;
        self.title = windowTitle;
        self.authInfo = authInfo;
        self.title.name = 'MScrobbler (Не авторизирован)';


        if (isAuthorized()) {
          $location.path('/index');
        }

        self.openAuthWindow = function openAuthWindow () {

          var myShowsUrl = 'https://myshows.me/oauth/authorize?response_type=code&';
          var authUrl = myShowsUrl + 'client_id=' + self.authInfo.options.client_id + '&scope=' + self.authInfo.options.scopes + '&redirect_uri=' + self.authInfo.options.redirect_uri;

          ipcRenderer.send('createAuthWindow', authUrl);
        }

        $('#templink').click(function() {
          openWindow();
        });


      }
    });
