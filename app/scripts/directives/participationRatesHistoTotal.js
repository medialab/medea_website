'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp')
  .directive('participationrateshistototal', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementWidth = element.width(),
            elementHeight = element.height();
        var histogram = new PowerLawHistogram();
        histogram.load('contents/data/participationRatesHisto/participations.json', function() {
          var width = elementWidth,
              height = elementHeight/2,
              margin = {top: 40, bottom: 70, left: 40, right: 40};

          histogram.drawChart('#containerTotal',
            {
              dataName: 'all',
              title: 'Participations over time',
              height: height,
              width: width,
              margin: margin
            });
      });
    }
  };
});
