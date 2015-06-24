angular.module('driveoutApp.main', [])
  .controller('MainCtrl', function ($scope, $location, content) {
    console.log(content);
    var retrievedContent = content.data;
    var studyPath = $location.path().replace(/\/\w*$/, '');
    retrievedContent.studyPath = studyPath;
    $scope.studyIntro = retrievedContent;
    console.log($scope)
  });
