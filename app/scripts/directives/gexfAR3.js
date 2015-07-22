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
        console.log(scope.index)
        $('#sigma-container').css({
            'position': 'absolute',
            'height': ($('.vizLegendZone').position().top + 5) + 'px',
            'width': '100%',
            'bottom': '30px',
            'margin-bottom': 30 + 'px'});
        scope.drawn = true;

        if (scope.index === 8) {
          drawGraph('sigma-container', 'currentAR', '3', function(sigmaInstance) {
            initateButtons(sigmaInstance);
          });
          changeSelectBox(3);
        }
        else if (scope.index === 9) {
          drawGraph('sigma-container', 'currentAR', '4', function(sigmaInstance) {
            initateButtons(sigmaInstance);
          });
          changeSelectBox(4);
        }

        scope.$on('updateView', function(event, index) {
          if (scope.index === 9 && index === 8) {
            drawGraph('sigma-container', 'currentAR', '3', function(sigmaInstance) {
              initateButtons(sigmaInstance);
            });
            changeSelectBox(3)
          }
          else if (scope.index === 8 && index === 9) {
            drawGraph('sigma-container', 'currentAR', '4', function(sigmaInstance) {
              initateButtons(sigmaInstance);
            });
            changeSelectBox(4)
          }
        });

        window.addEventListener('resize', function() {
          if (element.height() !== 0) {
            $('#sigma-container').css({
              'position': 'absolute',
              'height': ($('.vizLegendZone').position().top + 5) + 'px',
              'width': '100%',
              'bottom': '30px',
              'margin-bottom': 30 + 'px'});
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
            console.log(option);
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
