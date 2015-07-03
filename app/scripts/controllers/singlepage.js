'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:PageCtrl
 * @description
 * # PageCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp.singlepage', [])
  .controller('SinglePageCtrl', function ($scope, content) {
    $scope.content = content.data;
    $('html, body').scrollTop(0);
    console.log(content)
  });
