'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:PageCtrl
 * @description
 * # PageCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp')
  .controller('PageCtrl', function ($scope, items, $log, $routeParams) {
    $scope.items = items.data;
    
    $scope.$parent.folders = angular.copy($scope.items).filter(function(d) {
      if(d.type=='folder')
        return d;
    });

    // filter stuffs
    $scope.$watch('routes', function(){ // get title
      $scope.$parent.page = angular.copy($scope.routes)
        .filter(function(d){ return d.slug==$routeParams.page })
        .pop();
      $log.info('routes loaded', $scope.page)
    })
  });
