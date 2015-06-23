'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp.home', [])
  .controller('HomeCtrl', function ($scope, content) {
    $scope.content = content.data;
    $scope.$parent.page = {};

    $scope.$watch('routes', function(r){
      // get my pag
    })
  });
