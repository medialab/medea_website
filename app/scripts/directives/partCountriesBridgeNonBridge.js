'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp')
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
                height = elementHeight / 2,
                margin = {top: 40, bottom: 70, left: 40, right: 40};

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
        });
    }
  };
});
