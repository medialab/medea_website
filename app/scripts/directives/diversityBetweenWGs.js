'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.diversitybetweenwgs', [])
  .directive('diversitybetweenwgs', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementWidth = element.width(),
            elementHeight = element.height();
        var stackedBars = new StackedBarsRegionPartByWGs();
        var stackedBarsProp = new StackedBarsRegionPartProportionByWGs();

        stackedBars.load('contents/data/diversityBetweenWGs/participations.json', function() {
          stackedBarsProp.load('contents/data/diversityBetweenWGs/participations.json', function() {
            var legendHeight = $('.vizLegendZone').height();

            var imageHeight = $('.vizLegendZone').find('img').height();

            var width = elementWidth/2.1,
                height = elementHeight - legendHeight - (imageHeight === 0 ? 55 : 0),
                marginLeft = {top: 40, bottom: 15, left: 45, right: 10},
                marginRight = {top: 40, bottom: 15, left: 50, right: 10};

            stackedBars.drawViz('#svgContainerLeft',
              {
                height: height,
                width: width,
                vizName: 'viviz1',
                margin: marginLeft
              });

            stackedBarsProp.drawViz('#svgContainerRight',
            {
              height: height,
              width: width,
              vizName: 'viviz2',
              margin: marginRight
            });

            $('#svgContainerLeft svg').css({
              'position': 'absolute',
              'left': 0 + 'px',
              'bottom': (element.height()- $('.vizLegendZone').position().top +
                       (imageHeight === 0 ? 30: -5))+ 'px',
              'margin-bottom': 15 + 'px'
            });
            $('#svgContainerRight svg').css({
              'position': 'absolute',
              'right': 0 + 'px',
              'bottom': (element.height()- $('.vizLegendZone').position().top +
                       (imageHeight === 0 ? 30: -5))+ 'px',
              'margin-bottom': 15 + 'px'});

            window.addEventListener('resize', function() {
              if (element.width() !== 0) {
                var legendHeight = $('.vizLegendZone').height();
                var elementWidth = element.width(),
                    elementHeight = element.height();

                var imageHeight = $('.vizLegendZone').find('img').height();

                var width = elementWidth /2.1,
                    height = elementHeight - legendHeight - (imageHeight === 0 ? 55 : 0),
                    marginLeft = {top: 40, bottom: 15, left: 45, right: 10},
                    marginRight = {top: 40, bottom: 15, left: 50, right: 10};

                stackedBars.drawViz('#svgContainerLeft',
                  {
                    height: height,
                    width: width,
                    vizName: 'viviz1',
                    margin: marginLeft
                  });
                stackedBarsProp.drawViz('#svgContainerRight',
                {
                  height: height,
                  width: width,
                  vizName: 'viviz2',
                  margin: marginRight
                });
                $('#svgContainerLeft svg').css({
                  'position': 'absolute',
                  'left': 0 + 'px',
                  'bottom': (element.height()- $('.vizLegendZone').position().top +
                       (imageHeight === 0 ? 30: -5))+ 'px',
                  'margin-bottom': 15 + 'px'
                });
                $('#svgContainerRight svg').css({
                  'position': 'absolute',
                  'right': 0 + 'px',
                  'bottom': (element.height()- $('.vizLegendZone').position().top +
                       (imageHeight === 0 ? 30: -5))+ 'px',
                  'margin-bottom': 15 + 'px'
                });
              }
            });
          });
        });
      }
    };
  });
