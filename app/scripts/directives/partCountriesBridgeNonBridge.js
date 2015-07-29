'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.partcountrybridgenonbridge', [])
  .directive('partcountriesbridgenonbridge', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementWidth = element.width(),
            elementHeight = element.height();

        var histogram = new countryPartBridgenonBridge();
        histogram.load('contents/data/partCountriesBridgeNonBridge/participations.json', function() {
            var width = elementWidth,
                height = elementHeight / 2.5,
                margin = {top: 40, bottom: 45, left: 40, right: 25};

                histogram.drawChart('#containerNonBridge',
                  {
                    dataName: 'dataNonBridge',
                    title: 'Non-bridge authors',
                    height: height,
                    width: width,
                    margin: margin
                  });
                histogram.drawChart('#containerBridge',
                  {
                    dataName: 'dataBridge',
                    title: 'Bridge authors',
                    height: height,
                    width: width,
                    margin: margin
                  });
          $('#containerBridge svg').css({
            'position': 'absolute',
            'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
            'margin-bottom': 15 + 'px'});
        });
        window.addEventListener('resize', function() {
          if (element.width() !== 0) {
            var elementWidth = element.width(),
            elementHeight = element.height();

            histogram.load('contents/data/partCountriesBridgeNonBridge/participations.json', function() {
              var width = elementWidth,
                  height = elementHeight / 2.5,
                  margin = {top: 40, bottom: 45, left: 40, right: 25};

              histogram.drawChart('#containerNonBridge',
                {
                  dataName: 'dataNonBridge',
                  title: 'Non-bridge authors',
                  height: height,
                  width: width,
                  margin: margin
                });
              histogram.drawChart('#containerBridge',
                {
                  dataName: 'dataBridge',
                  title: 'Bridge authors',
                  height: height,
                  width: width,
                  margin: margin
                });
              $('#containerBridge svg').css({
                'position': 'absolute',
                'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
                'margin-bottom': 15 + 'px'});
            });
          }
        });
    }
  };
});
