'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:PageCtrl
 * @description
 * # PageCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp.page', [])
  .controller('PageCtrl', function ($scope, $routeParams) {

    $scope.tab = $routeParams.sub || 'introduction';


  });
