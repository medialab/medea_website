'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.diversityacrossar', [])
  .directive('diversityacrossar', function ($timeout) {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var stackedBars = new StackedBarsRegionPartByARs();
        var stackedBarsProp = new StackedBarsRegionPartProportionByARs();

        stackedBars.load('contents/data/diversityAcrossARs/participations.json', function() {
          $timeout(function() {
            var elementWidth = element.width(),
                elementHeight = element.height();

            var legendHeight = $('.vizLegendZone').height();
            var imageHeight = $('.vizLegendZone').find('img').height();
            console.log('legendHeight', legendHeight, 'imageHeight', imageHeight)

            var width = elementWidth/2.1,
                height = elementHeight - legendHeight - (imageHeight === 0 ? 55 : 0),
                margin = {top: 40, bottom: 15, left: 45, right: 10};

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
              'bottom': (elementHeight- $('.vizLegendZone').position().top +
                         (imageHeight === 0 ? 30: -5))+ 'px',
              'margin-bottom': 15 + 'px'});

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
              'bottom': (element.height()- $('.vizLegendZone').position().top +
                         (imageHeight === 0 ? 30: -5))+ 'px',
              'margin-bottom': 15 + 'px'});


            window.addEventListener('resize', function() {
              if (element.width() !== 0) {
                var legendHeight = $('.vizLegendZone').height();
                var elementWidth = element.width(),
                    elementHeight = element.height();

                var imageHeight = $('.vizLegendZone').find('img').height();

                var width = elementWidth/2.1,
                    height = elementHeight - legendHeight - (imageHeight === 0 ? 55 : 0),
                    margin = {top: 40, bottom: 15, left: 45, right: 10};

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
                  'bottom': (element.height()- $('.vizLegendZone').position().top +
                         (imageHeight === 0 ? 30: -5))+ 'px',
                  'margin-bottom': 15 + 'px'
                });
              }
            });
          });
        });
        stackedBarsProp.load('contents/data/diversityAcrossARs/participations.json', function() {
          $timeout(function() {
            var legendHeight = $('.vizLegendZone').height();
            var imageHeight = $('.vizLegendZone').find('img').height();

            var width = elementWidth/2.1,
                height = elementHeight - legendHeight - (imageHeight === 0 ? 55 : 0),
                margin = {top: 40, bottom: 15, left: 45, right: 10};

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
              'bottom': (element.height()- $('.vizLegendZone').position().top +
                         (imageHeight === 0 ? 30: -5))+ 'px',
              'margin-bottom': 15 + 'px'});

            window.addEventListener('resize', function() {
              if (element.width() !== 0) {
                var legendHeight = $('.vizLegendZone').height();
                var elementWidth = element.width(),
                    elementHeight = element.height();

                var imageHeight = $('.vizLegendZone').find('img').height();

                var width = elementWidth/2.1,
                    height = elementHeight - legendHeight - (imageHeight === 0 ? 55 : 0),
                    margin = {top: 40, bottom: 15, left: 45, right: 10};

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
