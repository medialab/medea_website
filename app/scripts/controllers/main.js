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

    var w = angular.element(window);
    w.on('resize', function() {
      var navBarHeight = $('nav')[0].offsetHeight,
          thumbsHeight = $('.thumbnailSl')[0].offsetHeight;
          console.log(thumbsHeight);
      var height = w.height() - navBarHeight - thumbsHeight - 50;

      console.log(w.height() - navBarHeight - thumbsHeight);
      console.log($('.narrative'))
      var narratives = $('.narrative');
      narratives.each(function(e){
        var nar = narratives[e];
        nar.setAttribute('style', 'height: ' + height + 'px;');
      })
    });
    w.on('load', function() {
      var navBarHeight = $('nav')[0].offsetHeight,
          thumbsHeight = $('.thumbnailSl')[0].offsetHeight;
          console.log(thumbsHeight);
      var height = w.height() - navBarHeight - thumbsHeight - 50;

      console.log(w.height() - navBarHeight - thumbsHeight);
      console.log($('.narrative'))
      var narratives = $('.narrative');
      narratives.each(function(e){
        var nar = narratives[e];
        nar.setAttribute('style', 'height: ' + height + 'px;');
      })
      // $('.narrative').css('height', height + 'px;')
    })

  });
