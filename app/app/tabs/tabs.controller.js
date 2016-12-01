tabsModule.
  component('tab', {
    template: '<ng-include src="$ctrl.tabTemplate()"/>',
    controller: function($timeout, serialInfo, windowTitle) {
      var self = this;
      self.startString = 'Для продолжения перетащите файл';
      self.defaultTab = 'tabs/tabs.template.html';
      self.currentTab = self.defaultTab;
      self.serialInfo = serialInfo;

      ipcRenderer.send('PlayerProcess');
      ipcRenderer.on('PlayerProcess-callback', (event, arg) => {
        $timeout(function(){
          self.serialInfo.answer = arg.answer;
          if (arg.isSerial) {
            windowTitle.name = windowTitle.appName + ' - ' + arg.answer;
            windowTitle.play = true;
            self.currentTab = 'tabs/parts/serial/serial.template.html'
            setTimeout(function() {
              $(document).trigger('serialEvent');
            }, 40);
          }
          else {
            self.currentTab = self.defaultTab;
            windowTitle.name = windowTitle.appName;
          };
             self.startString = arg.answer;
             windowTitle.play = false;
        }, 0);
      });

      this.tabTemplate = () => self.currentTab;
    }
  });
