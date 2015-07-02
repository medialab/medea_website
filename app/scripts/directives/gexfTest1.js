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
        drawGraph('sigma-container', 'currentAR', '1', function(sigmaInstance) {
          var sigmaRecenter = function(){
            var c = sigmaInstance.cameras[0]
            c.goTo({
              ratio: 1
              ,x: 0
              ,y: 0
            })
          }
          $('#recenterButton').on('click', sigmaRecenter);

          var sigmaZoom = function(){
            var c = sigmaInstance.cameras[0]
            c.goTo({
              ratio: c.ratio / c.settings('zoomingRatio')
            })
          }
          $('#zoomButton').on('click', sigmaZoom);

          var sigmaUnzoom = function(){
            var c = sigmaInstance.cameras[0]
            c.goTo({
              ratio: c.ratio * c.settings('zoomingRatio')
            })
          }
          $('#unzoomButton').on('click', sigmaUnzoom);
        });

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
