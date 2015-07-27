'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.diversityacrossar', [])
  .directive('diversityacrossar', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementWidth = element.width(),
            elementHeight = element.height();
        var stackedBars = new StackedBarsRegionPartByARs();
        var stackedBarsProp = new StackedBarsRegionPartProportionByARs();

        stackedBars.load('contents/data/diversityAcrossARs/participations.json', function() {
          var legendHeight = $('.vizLegendZone').height();

          var width = elementWidth/2.1,
              height = elementHeight - legendHeight,
              margin = {top: 40, bottom: 27, left: 45, right: 10};

          stackedBars.drawViz('#svgContainerLeft',
            {
              height: height,
              width: width,
              vizName: 'viviz',
              margin: margin
            });
          $('#svgContainerLeft svg').css({
            'position': 'absolute',
            'left': 0 + 'px',
            'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
            'margin-bottom': 30 + 'px'});

          window.addEventListener('resize', function() {
            if (element.width() !== 0) {
              var legendHeight = $('.vizLegendZone').height();
              var elementWidth = element.width(),
                  elementHeight = element.height();


              var width = elementWidth /2.1,
                  height = elementHeight - legendHeight,
                  margin = {top: 40, bottom: 27, left: 45, right: 10};

              stackedBars.drawViz('#svgContainerLeft',
                {
                  height: height,
                  width: width,
                  vizName: 'viviz',
                  margin: margin
                });
              $('#svgContainerLeft svg').css({
                'position': 'absolute',
                'left': 0 + 'px',
                'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
                'margin-bottom': 30 + 'px'
              });
            }
          });
        });
        stackedBarsProp.load('contents/data/diversityAcrossARs/participations.json', function() {
          var legendHeight = $('.vizLegendZone').height();

          var width = elementWidth/2.1,
              height = elementHeight - legendHeight,
              margin = {top: 40, bottom: 27, left: 50, right: 15};

          stackedBarsProp.drawViz('#svgContainerRight',
            {
              height: height,
              width: width,
              vizName: 'viviz',
              margin: margin
            });
          $('#svgContainerRight svg').css({
            'position': 'absolute',
            'right': 0 + 'px',
            'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
            'margin-bottom': 30 + 'px'});

          window.addEventListener('resize', function() {
            if (element.width() !== 0) {
              var legendHeight = $('.vizLegendZone').height();
              var elementWidth = element.width(),
                  elementHeight = element.height();


              var width = elementWidth /2.1,
                  height = elementHeight - legendHeight,
                  margin = {top: 40, bottom: 27, left: 50, right: 15};

              stackedBarsProp.drawViz('#svgContainerRight',
                {
                  height: height,
                  width: width,
                  vizName: 'viviz',
                  margin: margin
                });
              $('#svgContainerRight svg').css({
                'position': 'absolute',
                'right': 0 + 'px',
                'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
                'margin-bottom': 30 + 'px'
              });
            }
          });
        });
      }
    };
  });
