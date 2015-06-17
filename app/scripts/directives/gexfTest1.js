'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationByChapters
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.gexftestone', [])
  .directive('gexftestone', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        drawGraph('sigma-container', 'currentAR');
      }
    };
  });
