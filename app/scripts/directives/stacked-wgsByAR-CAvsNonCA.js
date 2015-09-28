'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.stackedwgsbyarcavsnonca', [])
  .directive('stackedwgsbyarcavsnonca', function ($timeout) {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var stackedBars = new StackedBarsWGsByARsCaVsOthers();
        stackedBars.load('contents/data/stacked-wgsByAR-CAvsNonCA/participations.json', function() {
          $timeout(function() {
            var elementWidth = element.width(),
                elementHeight = element.height();
            var legendHeight = $('.vizLegendZone').height();
            var imageHeight = $('.vizLegendZone').find('img').height();

            var width = elementWidth,
                height = elementHeight - legendHeight - (imageHeight === 0 ? 16 : 0),
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
                         (imageHeight === 0 ? 5: -5))+ 'px',
              'margin-bottom': 15 + 'px'});
          })
        });
        window.addEventListener('resize', function() {
          if (element.width() !== 0) {
            var legendHeight = $('.vizLegendZone').height();
            var elementWidth = element.width(),
                elementHeight = element.height();
            stackedBars.load('contents/data/stacked-wgsByAR-CAvsNonCA/participations.json', function() {
              var legendHeight = $('.vizLegendZone').height();
              var imageHeight = $('.vizLegendZone').find('img').height();

              var width = elementWidth,
                  height = elementHeight - legendHeight - (imageHeight === 0 ? 16 : 0),
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
                       (imageHeight === 0 ? 5: -5))+ 'px',
                'margin-bottom': 15 + 'px'});
                });
          }
        });
      }
    };
  });
