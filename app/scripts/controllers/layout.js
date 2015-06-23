'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:LayoutCtrl
 * @description
 * # LayoutCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp.layout', [])
  .controller('LayoutCtrl', function ($scope, $route, FilesFactory) {
    $scope.page = {};

    // inner pages
    $scope.pages  = [];
    $scope.routes = [];

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
