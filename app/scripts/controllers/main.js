'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp.main', [])
  .controller('MainCtrl', function ($scope, content) {
    $scope.content = content.data;
    $scope.$parent.page = {};

    $scope.$watch('routes', function(r){
      // get my pag
    })
  });
