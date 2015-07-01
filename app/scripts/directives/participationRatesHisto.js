'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.partratehisto', [])
  .directive('participationrateshisto', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementWidth = element.width(),
            elementHeight = element.height();
        var histogram = new PowerLawHistogram();
        histogram.load('contents/data/participationRatesHisto/participations.json', function() {
          var legendHeight = $('.vizLegendZone').height();

          var width = elementWidth,
              height = elementHeight/1.1 - legendHeight,
              margin = {top: 40, bottom: 35, left: 40, right: 40};
          histogram.drawChart('#containerNonBridge',
            {
              dataName: 'dataNonBridge',
              title: 'Non-bridge authors',
              height: height/2,
              width: width,
              margin: margin
            });
          histogram.drawChart('#containerBridge',
            {
              dataName: 'dataBridge',
              title: 'Bridge authors',
              height: height/2,
              width: width,
              margin: margin
            });
          $('#containerBridge svg').css({
            'position': 'absolute',
            'bottom': (element.height()- $('.vizLegendZone').position().top - 5 )+ 'px',
            'margin-bottom': 30 + 'px'});
      });

      window.addEventListener('resize', function() {
        if (element.width() !== 0) {
          var elementWidth = element.width(),
              elementHeight = element.height();
          histogram.load('contents/data/participationRatesHisto/participations.json', function() {
            var legendHeight = $('.vizLegendZone').height();

            var width = elementWidth,
                height = elementHeight/1.1 - legendHeight,
                margin = {top: 40, bottom: 35, left: 40, right: 40};
            histogram.drawChart('#containerNonBridge',
              {
                dataName: 'dataNonBridge',
                title: 'Non-bridge authors',
                height: height/2,
                width: width,
                margin: margin
              });
            histogram.drawChart('#containerBridge',
              {
                dataName: 'dataBridge',
                title: 'Bridge authors',
                height: height/2,
                width: width,
                margin: margin
              });
            $('#containerBridge svg').css({
              'position': 'absolute',
              'bottom': (element.height()- $('.vizLegendZone').position().top - 5 )+ 'px',
              'margin-bottom': 30 + 'px'});
          });
        }
      });
    }
  };
});
