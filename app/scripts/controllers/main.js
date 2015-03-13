'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp')
  .controller('MainCtrl', function ($scope, $log, content) {

    $scope.content = content.data;
    $scope.$parent.page = {};

    $scope.$watch('routes', function(r){
      $log.info('routes loaded');
      // get my pag
    })
  });
