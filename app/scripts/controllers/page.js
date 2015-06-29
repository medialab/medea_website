'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:PageCtrl
 * @description
 * # PageCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp.page', [])
  .controller('PageCtrl', function ($scope, content, $routeParams) {
    $scope.content = content.data;
    $scope.tab = $routeParams.sub || 'introduction';
  });
