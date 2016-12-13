settingsModule.
  component('settings', {
    templateUrl: 'core/settings/settings.template.html',
    controller: function(appSettings) {
      var self = this;
      self.appSettings = appSettings;
      self.periodInSecond =

      self.periodToMs = function () {
        self.appSettings.autoCheck.period = self.periodInSecond * 1000;
      }

      ipcRenderer.send('getAppSettings');
      ipcRenderer.on('pushAppSettings', (event, r) => {
        self.appSettings = r;
        self.periodInSecond = self.appSettings.autoCheck.period / 1000;
      });
    }
  });
