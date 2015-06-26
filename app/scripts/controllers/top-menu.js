angular.module('driveoutApp.topmenu', [])
  .controller('TopMenu', function ($scope, $location) {
    var studyPath = $location.path().replace(/\/\w*$/, '');
    $scope.currentPage = $location.path().replace(/^\//,'');
    $scope.isStory =  $location.path().replace(/^\//,'').search('/') !== -1;
    $scope.storySlug = $scope.isStory ? $scope.currentPage.replace(/\/\w*/,'') : '';
    console.log($scope.currentPage);
  });
