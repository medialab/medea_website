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
      $scope.$broadcast('zeppelin');
      var slElement = $('#container_' + container)[0].offsetTop - 60;
      $('html, body').animate({
        scrollTop: slElement
      });
    }

    var w = angular.element(window);
    $scope.$on('zeppelin', function() {
      var navBarHeight = $('nav')[0].offsetHeight,
          thumbsHeight = $('.thumbnailSl')[0].offsetHeight;
      var height = w.height() - navBarHeight - thumbsHeight - 50;

      var narratives = $('.narrative');
      narratives.each(function(e){
        var nar = narratives[e];
        nar.setAttribute('style', 'height: ' + height + 'px;');
      })
    })
    w.on('resize', function() {
      var navBarHeight = $('nav')[0].offsetHeight,
          thumbsHeight = $('.thumbnailSl')[0].offsetHeight;
      var height = w.height() - navBarHeight - thumbsHeight - 50;

      var narratives = $('.narrative');
      narratives.each(function(e){
        var nar = narratives[e];
        nar.setAttribute('style', 'height: ' + height + 'px;');
      })
    });

  });
