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
          var legendHeight = $('.vizLegendZone').height();

          var width = elementWidth,
              height = elementHeight - legendHeight,
              margin = {top: 40, bottom: 27, left: elementWidth/5, right: elementWidth/10};

          stackedBars.drawViz('#svgContainer',
            {
              height: height,
              width: width,
              vizName: 'viviz',
              margin: margin
            });
          $('#svgContainer svg').css({
            'position': 'absolute',
            'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
            'margin-bottom': 15 + 'px'});
        });
        window.addEventListener('resize', function() {
          if (element.width() !== 0) {
            var legendHeight = $('.vizLegendZone').height();
            var elementWidth = element.width(),
                elementHeight = element.height();
            stackedBars.load('contents/data/roleDistribStacked/participations.json', function() {
              var legendHeight = $('.vizLegendZone').height();

              var width = elementWidth,
                  height = elementHeight - legendHeight,
                  margin = {top: 40, bottom: 27, left: elementWidth/5, right: elementWidth/10};

              stackedBars.drawViz('#svgContainer',
                {
                  height: height,
                  width: width,
                  vizName: 'viviz',
                  margin: margin
                });
              $('#svgContainer svg').css({
                'position': 'absolute',
                'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
                'margin-bottom': 15 + 'px'});
                });
          }
        });
      }
    };
  });
