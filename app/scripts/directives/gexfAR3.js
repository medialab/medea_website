'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationByChapters
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.gexfarthree', [])
  .directive('gexfarthree', function () {
    return {
      restrict: 'EA',
      scope: {
        index: '='
      },
      link: function postLink(scope, element, attrs) {
        $('#sigma-container').css({
            'position': 'absolute',
            'height': ($('.vizLegendZone').position().top -25) + 'px',
            'width': '100%',
            'bottom': '30px',
            'margin-bottom': 30 + 'px'});
        scope.drawn = true;

        if (scope.index === 8) {
          if (scope.sigmaInstance !== undefined)
            scope.sigmaInstance.kill();

          drawGraph('sigma-container', 'currentAR', '3', function(sigmaInstance) {
            initateButtons(sigmaInstance);
            scope.sigmaInstance = sigmaInstance;
          });
          changeSelectBox(3);
        }
        else if (scope.index === 9) {
          if (scope.sigmaInstance !== undefined)
            scope.sigmaInstance.kill();

          drawGraph('sigma-container', 'currentAR', '4', function(sigmaInstance) {
            initateButtons(sigmaInstance);
            scope.sigmaInstance = sigmaInstance;
          });
          changeSelectBox(4);
        }

        scope.$on('updateView', function(event, index) {
          index = +index;

          if (scope.index === 9 && index === 8) {
            if (scope.sigmaInstance !== undefined)
              scope.sigmaInstance.kill();
            drawGraph('sigma-container', 'currentAR', '3', function(sigmaInstance) {
              initateButtons(sigmaInstance);
              scope.sigmaInstance = sigmaInstance;
            });
            changeSelectBox(3)
          }
          else if (scope.index === 8 && index === 9) {
            if (scope.sigmaInstance !== undefined)
              scope.sigmaInstance.kill();
            drawGraph('sigma-container', 'currentAR', '4', function(sigmaInstance) {
              initateButtons(sigmaInstance);
              scope.sigmaInstance = sigmaInstance;
            });
            changeSelectBox(4)
          }
          else if (scope.index !== 8 && scope.index !== 9) {
            if (scope.sigmaInstance !== undefined)
              scope.sigmaInstance.kill();
          }
          else {
          }
        });

        window.addEventListener('resize', function() {
          if (element.height() !== 0) {
            $('#sigma-container').css({
              'position': 'absolute',
              'height': ($('.vizLegendZone').position().top -25) + 'px',
              'width': '100%',
              'bottom': '30px',
              'margin-bottom': 30 + 'px'});

            if (scope.sigmaInstance !== undefined)
              scope.sigmaInstance.kill();
            drawGraph('sigma-container', 'currentAR', $('#currentAR')[0].value, function(sigmaInstance) {
            initateButtons(sigmaInstance);
          });
          }
        });

        function initateButtons(sigmaInstance) {
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
        }

        function changeSelectBox(value) {
          $('#currentAR option').each(function(index, option) {
            var currentValue = index + 1;

            if (currentValue !== value)
              $(option).attr('selected', null)
            else
              $(option).attr('selected', 1)
          });
        }
      }
    };
  });
