'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.roledistribstacked', [])
  .directive('roledistribstacked', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementWidth = element.width(),
            elementHeight = element.height();
        var stackedBars = new StackedBars();
        stackedBars.load('contents/data/roleDistribStacked/participations.json', function() {
          var width = elementWidth/1.1,
              height = elementHeight/1.1,
              margin = {top: 40, bottom: 20, left: elementWidth/5, right: elementWidth/10};

          stackedBars.drawViz('#svgContainer',
            {
              height: height,
              width: width,
              vizName: 'viviz',
              margin: margin
            });
        });
        window.addEventListener('resize', function() {
          if (element.width() !== 0) {
            var elementWidth = element.width(),
                elementHeight = element.height();
            stackedBars.load('contents/data/roleDistribStacked/participations.json', function() {
              var width = elementWidth/1.1,
                  height = elementHeight/1.1,
                  margin = {top: 40, bottom: 20, left: elementWidth/5, right: elementWidth/10};

              stackedBars.drawViz('#svgContainer',
                {
                  height: height,
                  width: width,
                  vizName: 'viviz',
                  margin: margin
                });
            });
          }
        });
      }
    };
  });
