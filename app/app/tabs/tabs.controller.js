tabsModule.
  component('tab', {
    template: '<ng-include class="change-tabs" src="$ctrl.tabTemplate()"/>',
    controller: function($timeout, serialInfo, windowTitle, appSettings) {
      var self = this;
      self.startString = 'Для продолжения перетащите файл';
      self.defaultTab = 'tabs/tabs.template.html';
      self.currentTab = self.defaultTab;
      self.serialInfo = serialInfo;

      //---- Запускаем интевал проверки на плеер ----//
      // ipcRenderer.send('PlayerProcess', 'timer');
      ipcRenderer.on('PlayerProcess-callback', (event, arg) => {

        $timeout(function(){
          self.serialInfo.answer = arg.answer;
          if (arg.isSerial) {
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

      this.tabTemplate = () => self.currentTab;
    }
  });
