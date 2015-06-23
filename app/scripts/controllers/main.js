angular.module('driveoutApp.main', [])
  .controller('MainCtrl', function ($scope, content) {
    console.log(content);
    var retrievedContent = content.data;
    $scope.studyIntro = retrievedContent;
    console.log($scope)
  });
