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
            'height': ($('.vizLegendZone').position().top + 5) + 'px',
            'width': '100%',
            'bottom': '30px',
            'margin-bottom': 30 + 'px'});
        drawGraph('sigma-container', 'currentAR');

        window.addEventListener('resize', function() {
          $('#sigma-container').css({
            'position': 'absolute',
            'height': ($('.vizLegendZone').position().top + 5) + 'px',
            'width': '100%',
            'bottom': '30px',
            'margin-bottom': 30 + 'px'});
          drawGraph('sigma-container', 'currentAR', $('#currentAR')[0].value);
        })
      }
    };
  });
