angular.module('driveoutApp.main', [])
  .controller('MainCtrl', function ($scope, $location, $http, content) {
    $('html, body').scrollTop(0);
    var retrievedContent = content.data;
    var studyPath = $location.path().replace(/\/\w*$/, '');
    retrievedContent.studyPath = studyPath;
    $scope.studyIntro = retrievedContent;
    $scope.storylines = {};

    for (var i = 0; i < retrievedContent.menu.length; i++) {
      var menuItem = retrievedContent.menu[i];

      if (menuItem.slug.search('main') === -1) {
        $http.get('contents'+ studyPath + '/' + menuItem.slug +'.json')
              .success(function(data) {
                $scope.storylines[data.slug] = data;
              });
      }
    }

    $scope.scrollDown = function(container) {
      var slElement = $('#container_' + container)[0].offsetTop - 60;
      $('html, body').animate({
        scrollTop: slElement
      });
    }

  });
