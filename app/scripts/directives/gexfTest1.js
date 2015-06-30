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
        $('#sigma-container').css({
            'position': 'absolute',
            'height': ($('.vizLegendZone').position().top) + 'px',
            'width': '100%',
            'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
            'margin-bottom': 30 + 'px'});
        drawGraph('sigma-container', 'currentAR');
      }
    };
  });
