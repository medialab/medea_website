angular.module('driveoutApp')
  .controller('SubchapterCtrl', function ($scope) {
    /**
     * This part of the code is dedicated to automatically choose the number
     * of columns needed to use.
     * If the number of elements is odd, the central element will be bigger than
     * than the others.
     */
    var subdivisionsSize = 12 / $scope.content.menu.length;

    $scope.isEven = 12 % $scope.content.menu.length === 0;
    var basicElement = {
      smSize : subdivisionsSize,
      mdSize : subdivisionsSize,
      lgSize : subdivisionsSize
    };
    $scope.basicBtStpClass = 'col-sm-' + basicElement.smSize +
                             ' col-md-' + basicElement.mdSize +
                             ' col-lg-' + basicElement.lgSize;
    if (!$scope.isEven) {
      var middleElement = {
        index: ($scope.content.menu.length / 2 + 1),
        mdSize: (subdivisionsSize + 1),
        lgSize: (subdivisionsSize + 1)
      };
      $scope.middleBtpClass = 'col-sm-' + middleElement.smSize +
                              ' col-md-' + middleElement.mdSize +
                              ' col-lg-' + middleElement.lgSize;
    }

  });
