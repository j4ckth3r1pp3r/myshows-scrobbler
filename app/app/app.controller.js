mainApp.
    component('main', {
      templateUrl: 'main.template.html',
      controller: function (windowTitle) {
        var self = this;
        self.title = windowTitle;
        self.title.name = 'no';

        function openWindow () {

          var options = {
              client_id: 'myshows_scrobbler',
              client_secret: 'SAlxyOdm4vPrlXSasbr1KTB8',
              scopes: 'basic'
          };

          const {BrowserWindow} = require('electron').remote;
          var authWindow = new BrowserWindow({
            width: 600,
            height: 650,
            show: false,
            skipTaskbar: true,
            resizable: false,
            title: 'Авторизация',
            'node-integration': false, });
          var myShowsUrl = 'https://myshows.me/oauth/authorize?response_type=code&';
          var authUrl = myShowsUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes;

          authWindow.setMenu(null);

          authWindow.loadURL(authUrl);
          authWindow.show();
        }

        $('#templink').click(function() {
          openWindow();
        });

      }
    });
