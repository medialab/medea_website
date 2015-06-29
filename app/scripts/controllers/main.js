angular.module('driveoutApp.main', [])
  .controller('MainCtrl', function ($scope, $location, $http, content) {
    $('html, body').scrollTop(0);
    var retrievedContent = content.data;
    var studyPath = $location.path().replace(/\/\w*$/, '');
    retrievedContent.studyPath = studyPath;
    $scope.studyIntro = retrievedContent;
  });
