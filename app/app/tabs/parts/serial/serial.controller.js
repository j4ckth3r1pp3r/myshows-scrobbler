tabsModule.
  controller('serialController', function($scope, serialInfo, msrequest, $sanitize, $timeout, appSettings) {
    var self = this;
    var shell = require('electron').shell;
    $scope.serialInfo = serialInfo;

    $scope.openExternal = function (url) {
      shell.openExternal(url);
    }


    //---- Получаем инфу по названию файла ----//
    function getSerialInfo () {
      //---- Сбрасываем всё состояние
      $scope.isLoaded = false;

      $scope.checkButton = {};
      $scope.myshowsInfo = {};
      $scope.serialPage = {};
      $scope.checkButton.text = 'Отметить';
      $scope.checkButton.disabled = false;
      $scope.buttonsRightImageShow = false;

      msrequest.get('shows.SearchByFile', {'file': $scope.serialInfo.answer}).then((r) => {
        $scope.myshowsInfo.byFile = r.data.result.show;

        $scope.myshowsInfo.currentEpisode = $scope.myshowsInfo.byFile.episodes[Object.keys($scope.myshowsInfo.byFile.episodes)[0]];

        getSerialInfoByUser($scope.myshowsInfo.byFile.id);
      }, (err) => {
        $scope.serialTemplate = 'notfound';
      });
    }

    //---- Получаем инфу (ID) о последней просмотренной серии ----//
    function getSerialInfoByUser (serialId) {
      msrequest.get('profile.Episodes', {'showId': serialId}).then((r) => {
        $scope.myshowsInfo.byUser = r.data.result;

        //---- Чекаем серию на предмет того, просмотрена уже или нет ----//
        $scope.myshowsInfo.currentEpisode.watchStatus = $scope.myshowsInfo.byUser.find(({id}) => id == $scope.myshowsInfo.currentEpisode.id);
        if ($scope.myshowsInfo.currentEpisode.watchStatus) $scope.myshowsInfo.currentEpisode.watchStatus = true;
        else $scope.myshowsInfo.currentEpisode.watchStatus = false;

        $scope.myshowsInfo.byUser = $scope.myshowsInfo.byUser[$scope.myshowsInfo.byUser.length - 1];
        getLastSeenEpisode($scope.myshowsInfo.byUser.id);
      });
    }

    //---- Получаем инфу о последнем просмотренном эпизоде ----//
    function getLastSeenEpisode (episodeId) {
      msrequest.get('shows.Episode', {'id': episodeId}).then((r) => {
        $scope.myshowsInfo.lastEpisode = r.data.result;

        lastAction(r);
      });
    }

    function lastAction (r) {
      $scope.serialTemplate = `found`;
      $timeout(function() {
        $scope.isLoaded = true;
        $(window).trigger('resize');
        $scope.buttonsRightImageShow = true;
      }, 1000);

      //---- Добавляем фон сериала ----//
      msrequest.getPage(`https://myshows.me/view/${$scope.myshowsInfo.currentEpisode.showId}/`).then((r) => {
        r.data = r.data.replace(/body/g, 'bodytag');
        r.data = r.data.replace(/html/g, 'htmltag');
        $scope.serialPage.background = $(r.data).find('bodytag').attr('style').match(/url\((.*)\)/)[1];
        $(window).resize(function() {
          $('.serial-loading, .light-background').not('.uil-facebook-css').height($(window).height() - 52);
        });


      });
    }

    $(document).on('serialEvent', function() {
      getSerialInfo();
    });

    //---- Кнопка отметки серии ----//
    $scope.checkEpisode = function () {
      $scope.checkButton.text = 'Подождите...';
      msrequest.get('manage.CheckEpisode', {'id' : $scope.myshowsInfo.currentEpisode.id}).then((r) => {
        var isCurrentEpisodeNewestThanLast = ($scope.myshowsInfo.lastEpisode.shortName.match(/s(\d*)/)[1] <= $scope.myshowsInfo.currentEpisode.shortName.match(/s(\d*)/)[1]) && ($scope.myshowsInfo.lastEpisode.shortName.match(/e(\d*)/)[1] < $scope.myshowsInfo.currentEpisode.shortName.match(/e(\d*)/)[1]);

        $timeout(function() {
          $scope.myshowsInfo.currentEpisode.watchStatus = true;
        }, 4000);

        $scope.checkButton.text = 'Отмечено ✓';
        $scope.checkButton.disabled = r.data.result;
        if (isCurrentEpisodeNewestThanLast) {
          $scope.myshowsInfo.lastEpisode.shortName = $scope.myshowsInfo.currentEpisode.shortName;
        }
      });
    }


  });
