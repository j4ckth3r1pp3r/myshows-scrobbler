tabsModule.
  controller('serialController', function($scope, serialInfo, msrequest, $sanitize, $timeout) {
    var self = this;
    $scope.serialInfo = serialInfo;
    $scope.myshowsInfo = {};

    //---- Получаем инфу по названию файла ----//
    function getSerialInfo () {

      $scope.isLoaded = false;

      msrequest.get('shows.SearchByFile', {'file': $scope.serialInfo.answer}).then((r) => {
        $scope.serialTemplate = `found`;
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
        $scope.myshowsInfo.byUser = $scope.myshowsInfo.byUser[$scope.myshowsInfo.byUser.length - 1];
        getLastSeenEpisode($scope.myshowsInfo.byUser.id);
      });
    }

    //---- Получаем инфу о последнем просмотренном эпизоде ----//
    function getLastSeenEpisode (episodeId) {
      msrequest.get('shows.Episode', {'id': episodeId}).then((r) => {
        $scope.myshowsInfo.lastEpisode = r.data.result;
        // console.log($scope.myshowsInfo.lastEpisode);
        $timeout(function() {
          $scope.isLoaded = true;
        }, 1000);
      });
    }


    $(document).on('serialEvent', function() {
      getSerialInfo();
    });


  });
