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
    $('html, body').scrollTop(0);
    console.log('pageScope', $scope);
    var studyPath = $location.path().replace(/\/[^\/]*$/, '');
    $scope.content.studyPath = studyPath;
    $scope.tab = $routeParams.sub || 'introduction';
    $scope.index = 0;
    $scope.automatedScroll = false;
    $scope.getCurrentIndex = function() {
      return $scope.index;
    };
    $scope.getScrollFlag = function() {
      return $scope.automatedScroll;
    }
  });
