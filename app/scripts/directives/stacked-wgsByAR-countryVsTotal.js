'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.stackedwgsbyarcountryvstotal', [])
  .directive('stackedwgsbyarcountryvstotal', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementWidth = element.width(),
            elementHeight = element.height();
        var stackedBars = new StackedBarsWGsByARsCountryVsTotal();
        stackedBars.load('contents/data/stacked-wgsByAR-countryVsTotal/participations.json', function() {
          var legendHeight = $('.vizLegendZone').height();
          var imageHeight = $('.vizLegendZone').find('img').height();

          var width = elementWidth,
              height = elementHeight - legendHeight - (imageHeight === 0 ? 55 : 0),
              margin = {top: 40, bottom: 27, left: 50, right: -18};

          stackedBars.drawViz('#svgContainer',
            {
              height: height,
              width: width,
              vizName: 'viviz',
              margin: margin
            });
          $('#svgContainer svg').css({
            'position': 'absolute',
            'bottom': (element.height()- $('.vizLegendZone').position().top +
                       (imageHeight === 0 ? 25: -5))+ 'px',
            'margin-bottom': 15 + 'px'});
        });
        window.addEventListener('resize', function() {
          if (element.width() !== 0) {
            var legendHeight = $('.vizLegendZone').height();
            var imageHeight = $('.vizLegendZone').find('img').height();
            var elementWidth = element.width(),
                elementHeight = element.height();
            stackedBars.load('contents/data/stacked-wgsByAR-countryVsTotal/participations.json', function() {
              var legendHeight = $('.vizLegendZone').height();

              var width = elementWidth,
                  height = elementHeight - legendHeight - (imageHeight === 0 ? 55 : 0),
                  margin = {top: 40, bottom: 27, left: 50, right: -18};

              stackedBars.drawViz('#svgContainer',
                {
                  height: height,
                  width: width,
                  vizName: 'viviz',
                  margin: margin
                });
              $('#svgContainer svg').css({
                'position': 'absolute',
                'bottom': (element.height()- $('.vizLegendZone').position().top +
                       (imageHeight === 0 ? 25: -5))+ 'px',
                'margin-bottom': 15 + 'px'});
                });
          }
        });
      }
    };
  });
