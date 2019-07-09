'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationByChapters
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.gexfinstitutions', [])
  .directive('gexfinstitutions', function () {
    return {
      restrict: 'EA',
      scope: {
        index: '='
      },
      link: function postLink(scope, element, attrs) {
        $('#sigma-container').css({
            'position': 'absolute',
            'height': ($('.vizLegendZone').position().top - 25) + 'px',
            'width': '100%',
            'bottom': '30px',
            'margin-bottom': 30 + 'px'});

        drawGraphInstitutions('sigma-container', function(sigmaInstance) {
          scope.sigmaInstance = sigmaInstance;
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

        scope.$on('updateView', function(event, index) {
          if (scope.index !== 3) {
            if (scope.sigmaInstance !== undefined)
              scope.sigmaInstance.kill();
          }
        });

        window.addEventListener('resize', function() {
          if (element.height() !== 0) {
            $('#sigma-container').css({
              'position': 'absolute',
              'height': ($('.vizLegendZone').position().top - 25) + 'px',
              'width': '100%',
              'bottom': '30px',
              'margin-bottom': 30 + 'px'});
            if (scope.sigmaInstance !== undefined)
              scope.sigmaInstance.kill();
            drawGraph('sigma-container', 'currentAR', $('#currentAR')[0].value);
          }
        })
      }
    };
  });
