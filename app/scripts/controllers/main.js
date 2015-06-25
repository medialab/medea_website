angular.module('driveoutApp.main', [])
  .controller('MainCtrl', function ($scope, $location, $http, content) {
    $('html, body').scrollTop(0);
    var retrievedContent = content.data;
    var studyPath = $location.path().replace(/\/\w*$/, '');
    retrievedContent.studyPath = studyPath;
    $scope.studyIntro = retrievedContent;
    $scope.storylines = {};
    $scope.oneClicked = false;
    $scope.slClicked = '';
    $scope.location = $location;
    $scope.addressByUser = true;

    $scope.$watch('location.url()', function(e) {
      var potSL = e.replace(studyPath, '').replace('/main#', '');
      console.log(potSL, $scope);
      if (Object.keys($scope.storylines).indexOf(potSL) !== -1 && $scope.addressByUser) {
        $('#container_' + potSL + ' > div > a').click();
      }
    })

    $scope.clickSL = function(slug) {
      $scope.oneClicked = !$scope.oneClicked;

      if (slug === $scope.slClicked)
        $scope.slClicked = '';
      else
        $scope.slClicked = slug;
    }

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
      // var slElement = $('#container_' + container)[0].offsetTop - 60;
      // $('html, body').animate({
      //   scrollTop: slElement
      // });
    }

    var w = angular.element(window);
    $scope.$on('zeppelin', function() {
      var navBarHeight = $('nav')[0].offsetHeight,
          thumbsHeight = $('.thumbnailSl')[0].offsetHeight,
          introHeight = $('#studyIntroduction')[0].offsetHeight;
          console.log(introHeight)
      var height = w.height() - navBarHeight - thumbsHeight - introHeight - 80;

      var narrativeContainer = $('.narrativeContainer');
      narrativeContainer.each(function(e){
        var nar = narrativeContainer[e];
        $(nar).css('margin-top', thumbsHeight + 20);
      });

      var narratives = $('.narrative');
      narratives.each(function(e){
        var nar = narratives[e];
        nar.setAttribute('style', 'height: ' + height + 'px;');
      })
    })
    w.on('resize', function() {
      var navBarHeight = $('nav')[0].offsetHeight,
          thumbsHeight = $('.thumbnailSl')[0].offsetHeight,
          introHeight = $('#studyIntroduction')[0].offsetHeight;
          console.log(introHeight)
      var height = w.height() - navBarHeight - thumbsHeight - introHeight - 80;

      var narrativeContainer = $('.narrativeContainer');
      narrativeContainer.each(function(e){
        var nar = narrativeContainer[e];
        $(nar).css('margin-top', thumbsHeight + 20);
      });

      var narratives = $('.narrative');
      narratives.each(function(e){
        var nar = narratives[e];
        nar.setAttribute('style', 'height: ' + height + 'px;');
      })
    });

  });
