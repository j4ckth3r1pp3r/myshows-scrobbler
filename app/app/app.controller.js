mainApp.
    component('main', {
      templateUrl: 'main.template.html',
      controller: function (windowTitle) {
        var self = this;
        self.title = windowTitle;
        self.title.name = 'no';
        let authWindow;


        function openWindow () {

          var options = {
              client_id: 'myshows_scrobbler',
              client_secret: 'SAlxyOdm4vPrlXSasbr1KTB8',
              scopes: 'basic',
              redirect_uri: 'myshows://oauth-callback/myshows'
          };

          const {BrowserWindow} = require('electron').remote;
          authWindow = new BrowserWindow({
            width: 600,
            height: 650,
            show: false,
            skipTaskbar: true,
            // resizable: false,
            title: 'Авторизация',
            backgroundColor: '#000',
            'node-integration': false, });
          var myShowsUrl = 'https://myshows.me/oauth/authorize?response_type=code&';
          var authUrl = myShowsUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes + '&redirect_uri=' + options.redirect_uri;

          console.log(authUrl);

          authWindow.setMenu(null);

          authWindow.on('page-title-updated', function(event) {
            event.preventDefault();
          });

          authWindow.loadURL(authUrl);
          authWindow.show();
          authWindow.webContents.openDevTools();
        }

        $('#templink').click(function() {
          openWindow();
        });

      }
    });
