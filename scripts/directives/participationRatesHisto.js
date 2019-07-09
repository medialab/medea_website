'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.partratehisto', [])
  .directive('participationrateshisto', function ($timeout) {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementWidth = element.width(),
            elementHeight = element.height();
        var histogram = new PowerLawHistogram();
        histogram.load('contents/data/participationRatesHisto/participations.json', function() {
          $timeout(function() {
            var legendHeight = $('.vizLegendZone').height();
            console.log('legendHeight', legendHeight)

            var width = elementWidth,
                height = elementHeight/1.1 - legendHeight,
                margin = {top: 40, bottom: 45, left: 40, right: 25},
                xOffset = 15;
            histogram.drawChart('#containerNonBridge',
              {
                dataName: 'dataNonBridge',
                title: 'Non-bridge authors',
                height: height/2,
                width: width,
                margin: margin,
                xOffset: xOffset
              });
            histogram.drawChart('#containerBridge',
              {
                dataName: 'dataBridge',
                title: 'Bridge authors',
                height: height/2,
                width: width,
                margin: margin,
                xOffset: xOffset
              });
            $('#containerBridge svg').css({
              'position': 'absolute',
              'bottom': (element.height()- $('.vizLegendZone').position().top - 5 )+ 'px',
              'margin-bottom': 15 + 'px'});
          });

        window.addEventListener('resize', function() {
          if (element.width() !== 0) {
            var elementWidth = element.width(),
                elementHeight = element.height();
            var legendHeight = $('.vizLegendZone').height();

            var width = elementWidth,
                height = elementHeight/1.1 - legendHeight,
                margin = {top: 40, bottom: 45, left: 40, right: 25};
            histogram.drawChart('#containerNonBridge',
              {
                dataName: 'dataNonBridge',
                title: 'Non-bridge authors',
                height: height/2,
                width: width,
                margin: margin,
                xOffset: xOffset
              });
            histogram.drawChart('#containerBridge',
              {
                dataName: 'dataBridge',
                title: 'Bridge authors',
                height: height/2,
                width: width,
                margin: margin,
                xOffset: xOffset
              });
            $('#containerBridge svg').css({
              'position': 'absolute',
              'bottom': (element.height()- $('.vizLegendZone').position().top - 5 )+ 'px',
              'margin-bottom': 15 + 'px'});
          }
        });
      });
    }
  };
});
