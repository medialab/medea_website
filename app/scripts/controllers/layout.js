'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:LayoutCtrl
 * @description
 * # LayoutCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp')
  .controller('LayoutCtrl', function ($scope, $route, FilesFactory) {
    $scope.page = {};

    // inner pages
    $scope.pages  = [];
    $scope.routes = [];

    $scope.currentSLindex = 0;
    $scope.indexVerified = false;

    $scope.checkSLIndex = function() {
      if (! $scope.indexVerified ) {
        $scope.$$childTail.content.menu.forEach(function(e, i) {
          if (e.slug === window.location.hash.replace(/#\/(\w)*\//, ''))
            $scope.currentSLindex = i;
        });
        $scope.indexVerified = true;
      }
    }

    $scope.nextSL = function() {
      //sets the index of the current story line if needed
      if (! $scope.indexVerified ) {
        $scope.$$childTail.content.menu.forEach(function(e, i) {
          if (e.slug === window.location.hash.replace(/#\/(\w)*\//, ''))
            $scope.currentSLindex = i;
        });
        $scope.indexVerified = true;
      }

      var sls = $scope.$$childTail.content.menu,
          nextIndex = $scope.currentSLindex + 1;
      if (nextIndex < sls.length) {
        $scope.currentSLindex = nextIndex;
      }
      window.location.hash = '#/' + $scope.page.slug + '/' +
                    $scope.$$childTail.content.menu[$scope.currentSLindex].slug;
    };

    $scope.previousSL = function() {
      //sets the index of the current story line if needed
      if (! $scope.indexVerified ) {
        $scope.$$childTail.content.menu.forEach(function(e, i) {
          if (e.slug === window.location.hash.replace(/#\/(\w)*\//, ''))
            $scope.currentSLindex = i;
        });
        $scope.indexVerified = true;
      }

      var sls = $scope.$$childTail.content.menu,
          nextIndex = $scope.currentSLindex - 1;
      if (nextIndex >= 0) {
        $scope.currentSLindex = nextIndex;
      }
      window.location.hash = '#/' + $scope.page.slug + '/' +
                    $scope.$$childTail.content.menu[$scope.currentSLindex].slug;
    };

    // $scope.nextSL = function() {
    //   console.log($scope.$$childTail);
    // };

    //Stores the folders (routes) and the pages (pages) in the layout scope
    FilesFactory.get({path: 'index'}).then(function (res) {
      var routes,
          pages;

      routes = res.data.filter(function (d) {
        if(d.type === 'folder')
          return d
      });

      pages = res.data.filter(function (d) {
        if(d.type !== 'folder')
          return d
      });

      $scope.pages = pages;
      $scope.routes = routes;

    });
  });
