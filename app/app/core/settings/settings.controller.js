settingsModule.
  component('settings', {
    templateUrl: 'core/settings/settings.template.html',
    controller: function(appSettings, $timeout) {
      var self = this;
      self.appSettings = appSettings;
      console.log('start', self.appSettings);
      self.oldSettings = {};

      self.playerOptions = [
        {
          process: 'PotPlayerMini',
          label: 'PotPlayer'
        },
        {
          process: 'KMPlayer',
          label: 'KMPlayer'
        },
        {
          process: 'None',
          label: 'Свой плеер'
        }
      ];



      self.changeOption = () => {
        self.appSettings.playerProcess = self.playerOptionCurrent.process;
        self.checkDifference();
      }

      self.periodToMs = function () {
        self.appSettings.autoCheck.period = self.periodInSecond * 1000;
        self.checkDifference();
      }

      ipcRenderer.send('getAppSettings');
      ipcRenderer.on('pushAppSettings', (event, r) => {
        $timeout(function() {
          self.appSettings = r;
          console.log('New', self.appSettings);
          self.periodInSecond = self.appSettings.autoCheck.period / 1000;
          self.checkDifference();
          self.playerOptionCurrent = self.playerOptions.find(({process}) => process === self.appSettings.playerProcess) || {process: 'None', label: 'Свой плеер'};
        }, 40);
      });

      self.saveSettings = () => {
        ipcRenderer.send('saveSettings', self.appSettings);
        self.oldSettings = angular.copy(self.appSettings);

        self.checkDifference();
      }

      self.checkDifference = () => {
        self.isDifferent = JSON.stringify(self.oldSettings) == JSON.stringify(self.appSettings);

        if (self.isDifferent) {
          self.saveButtonClass = 'btn btn-success btn-noBorderRadius';
          self.saveButtonText = 'Сохранено';
          self.isSettingsSaved = true;
        } else {
          self.saveButtonText = 'Сохранить';
          self.saveButtonClass = 'btn btn-dark';
          self.isSettingsSaved = false;
        }
      }
    }
  });
