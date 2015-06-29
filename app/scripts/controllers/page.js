'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:PageCtrl
 * @description
 * # PageCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp.page', [])
  .controller('PageCtrl', function ($scope, content, $location, $routeParams) {
    $scope.content = content.data;
    var studyPath = $location.path().replace(/\/[^\/]*$/, '');
    console.log(studyPath);
    $scope.content.studyPath = studyPath;
    $scope.tab = $routeParams.sub || 'introduction';
  });
