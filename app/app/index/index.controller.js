indexModule.
  component('index', {
    templateUrl: 'index/index.template.html',
    controller: function(windowTitle, $http, userinfo, $location, msrequest) {
      var self = this;
      self.title = windowTitle;
      self.title.name = 'MyShows Scrobbler';

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

      //---- Инфа профиля ----//
      $(document).on('userInfoDone', function() {
        self.username = userinfo.login();
        ipcRenderer.send('saveFile', {
          fileName: self.username + '.jpg',
          fileLink: userinfo.avatar()
        });
        userinfo.avatar(appdata + self.username + '.jpg');
        self.avatar = userinfo.avatar();
      });
      if (userinfo.login() !== null) {
        self.username = userinfo.login();
        self.avatar = userinfo.avatar();
      }

      ipcRenderer.send('testcmd');

      ipcRenderer.on('testcmd', (event, arg) => {
        console.log(arg) // prints "pong"
      });

    (function () {
        var holder = document.querySelector('.draggable');

        $(window).resize(function() {
          var marginTextBorder = ($(holder).find('.border').height() / 2) - $(holder).find('h2').height() / 2;
          $(holder).find('h2').css('margin-top', marginTextBorder);
        });

        $(window).trigger('resize');


        holder.ondragover = () => {
            $(holder).addClass('dragover');
            return false;
        };

        holder.ondragleave = () => {
            $(holder).removeClass('dragover');
            return false;
        };

        holder.ondragend = () => {
            $(holder).removeClass('dragover');
            return false;
        };

        holder.ondrop = (e) => {
            e.preventDefault();
            $(holder).removeClass('dragover');
            msrequest.get('shows.SearchByFile', {'file': e.dataTransfer.files[0].name}).then(function(r) {
              console.log(r.data);
            });

            console.log("File:", e.dataTransfer.files[0].name);

            return false;
        };
    })();

    }
  });
