indexModule.
  component('index', {
    templateUrl: 'index/index.template.html',
    controller: function(windowTitle, $http, userinfo, $location, msrequest, appSettings) {
      var self = this;
      self.title = windowTitle;
      self.title.name = 'MScrobbler';
      self.appSettings = appSettings;

      self.username = 'Wait...';
      self.avatar = `file:///${__dirname}/img/loading.gif`;


      if (!isAuthorized()) {
        $location.path('/');
        return;
      }

      $(document).ready(function() {
          $('.dropdown-toggle').dropdown();
      });

      self.logout = function () {
        localStorage.clear();
        $location.path('/');
      }

      self.settings = function() {
        ipcRenderer.send('createSettingsWindow');
      }

      //---- Инфа профиля ----//
      $(document).on('userInfoDone', function() {
        self.username = userinfo.login();
        ipcRenderer.send('saveFile', {
          fileName: self.username + '.jpg',
          fileLink: userinfo.avatar()
        });
        self.avatar = userinfo.avatar();
        userinfo.avatar(appdata + self.username + '.jpg');
      });
      if (userinfo.login() !== null) {
        self.username = userinfo.login();
        self.avatar = userinfo.avatar();
      }

      self.RefreshStatus = () => {ipcRenderer.send('PlayerProcess', 'force')};
      self.toogleDevTools = () => {ipcRenderer.send('toogleDevTools')};

      ipcRenderer.send('getAppSettings');
      ipcRenderer.on('pushAppSettings', (event, r) => {
        self.appSettings.all = r;
        if (self.appSettings.all.autoCheck.enabled) ipcRenderer.send('PlayerProcess', 'timer');
      });

      //---- Функции для Drag'n'Drop ----//
      // var holder = document.querySelector('.draggable');
      //
      // $(window).resize(function() {
      //   var marginTextBorder = ($(holder).find('.border').height() / 2) - $(holder).find('h2').height() / 2;
      //   $(holder).find('h2').css('margin-top', marginTextBorder);
      // });
      //
      // $(window).trigger('resize');
      //
      //
      // holder.ondragover = () => {
      //     $(holder).addClass('dragover');
      //     return false;
      // };
      //
      // holder.ondragleave = () => {
      //     $(holder).removeClass('dragover');
      //     return false;
      // };
      //
      // holder.ondragend = () => {
      //     $(holder).removeClass('dragover');
      //     return false;
      // };
      //
      // holder.ondrop = (e) => {
      //     e.preventDefault();
      //     $(holder).removeClass('dragover');
      //     msrequest.get('shows.SearchByFile', {'file': e.dataTransfer.files[0].name}).then((r) => {
      //       console.log('Сукес: ', r.data);
      //     }, (err) => {
      //       console.log('Error: ', err);
      //     });
      //
      //     return false;
      // };

    }
  });
