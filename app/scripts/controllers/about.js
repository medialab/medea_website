'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp.about', [])
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
