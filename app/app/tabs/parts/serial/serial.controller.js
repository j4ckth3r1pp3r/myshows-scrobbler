tabsModule.
  controller('serialController', function($scope, serialInfo, msrequest, $sanitize) {
    var self = this;
    $scope.serialInfo = serialInfo;
    $scope.myshowsInfo = {};

    function getSerialInfo () {
      msrequest.get('shows.SearchByFile', {'file': $scope.serialInfo.answer}).then((r) => {
        // console.log('Сукес: ', r.data);
        $scope.serialTemplate = `found`;
        $scope.myshowsInfo = r.data.result.show;
        console.log($scope.myshowsInfo);
      }, (err) => {
        // console.log('Error: ', err);
        $scope.serialTemplate = 'notfound';
      });
    }

    $(document).on('serialEvent', function() {
      getSerialInfo();
    });


  });
