'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:PageCtrl
 * @description
 * # PageCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp')
  .controller('PageCtrl', function ($scope, content, $routeParams) {
    $scope.content = content.data;

    $scope.tab = $routeParams.sub || 'introduction';

    // filter stuffs
    $scope.$watch('routes', function(){ // get title
      $scope.$parent.page = angular.copy($scope.routes)
        .filter(function(d){ return d.slug === $routeParams.page })
        .pop();

    });
  });
