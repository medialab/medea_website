'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.partratehistototal', [])
  .directive('participationrateshistototal', function () {
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
              height = elementHeight/1.2 - legendHeight,
              margin = {top: 40, bottom: 45, left: 40, right: 22};

          histogram.drawChart('#containerTotal',
            {
              dataName: 'all',
              height: height,
              width: width,
              margin: margin
            });
          $('#containerTotal svg').css({
            'position': 'absolute',
            'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
            'margin-bottom': 15 + 'px'});
      });

      window.addEventListener('resize', function() {
        if (element.height() !== 0) {
          var elementWidth = element.width(),
              elementHeight = element.height();
          histogram.load('contents/data/participationRatesHisto/participations.json', function() {
            var legendHeight = $('.vizLegendZone').height();
            var width = elementWidth,
                height = elementHeight/1.2 - legendHeight,
                margin = {top: 40, bottom: 45, left: 40, right: 22};

            histogram.drawChart('#containerTotal',
              {
                dataName: 'all',
                height: height,
                width: width,
                margin: margin
              });
            $('#containerTotal svg').css({
              'position': 'absolute',
              'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
              'margin-bottom': 15 + 'px'});
          });
        }
      });
    }
  };
});
