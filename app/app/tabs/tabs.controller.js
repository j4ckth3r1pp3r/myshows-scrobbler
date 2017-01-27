tabsModule.
  component('tab', {
    template: '<ng-include class="change-tabs" src="$ctrl.tabTemplate()"/>',
    controller: function($timeout, serialInfo, windowTitle, appSettings) {
      var self = this;
      self.startString = 'Для продолжения перетащите файл';
      self.defaultTab = 'tabs/tabs.template.html';
      self.currentTab = self.defaultTab;
      self.serialInfo = serialInfo;
      self.windowTitle = windowTitle;

      //---- Запускаем интевал проверки на плеер ----//
      ipcRenderer.on('refreshSettings', (event, r) => {
        appSettings = r;

        if (appSettings.autoCheck.enabled) ipcRenderer.send('PlayerProcess', 'startTimer');
        else ipcRenderer.send('PlayerProcess', 'stopTimer');
      })

      ipcRenderer.on('PlayerProcess-callback', (event, arg) => {

        $(document).trigger('showSerialFeedback', arg);
        self.isNotFoundSerial = false;

      });

      $(document).on('showSerialFeedback', function (event, arg) {
        $timeout(function(){
          self.serialInfo.answer = arg.answer;
          self.isNotFoundSerial = false;
          console.log(arg.isSerial);
          if (arg.isSerial) {
            self.closeNotFoundNotification();
            windowTitle.name = windowTitle.appName + ' - ' + arg.answer;
            windowTitle.playStatus = true;
            self.currentTab = 'tabs/parts/serial/serial.template.html'
            setTimeout(function() {
              $(document).trigger('serialEvent');
            }, 40);
          }
          else {
            self.currentTab = self.defaultTab;
            windowTitle.name = windowTitle.appName;
            windowTitle.playStatus = false;
          };
             self.startString = arg.answer;
        }, 0);
      });

      //---- Серия не найдена ----//
      $(document).on('serialNotFound', function () {
        self.currentTab = self.defaultTab;
        windowTitle.name = windowTitle.appName;
        windowTitle.playStatus = false;
        self.isNotFoundSerial = true;
      });

      self.closeNotFoundNotification = () => {self.isNotFoundSerial = false};
      self.closeWebServerNotification = () => {self.windowTitle.webServerStatus = false};

      this.tabTemplate = () => self.currentTab;
    }
  });
