'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.partcountry9010', [])
  .directive('partcountriesninetypercent', function ($timeout) {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementWidth = element.width(),
            elementHeight = element.height();

        var histogram = new countryPart9010();;
        histogram.load('contents/data/partCountries90-10/participations.json', function() {
          $timeout(function() {
            var width = elementWidth,
                height = elementHeight / 1.4,
                margin = {top: 40, bottom: 44, left: 40, right: 22};

            histogram.drawChart('#container',
              {
                title: 'Non-bridge authors',
                height: height,
                width: width,
                margin: margin
              });
            $('#container svg').css({
              'position': 'absolute',
              'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
              'margin-bottom': 15 + 'px'});

          })
        });
        window.addEventListener('resize', function() {
          if (element.width() !== 0) {
            var elementWidth = element.width(),
            elementHeight = element.height();

            histogram.load('contents/data/partCountries90-10/participations.json', function() {
              var width = elementWidth,
                  height = elementHeight / 1.4,
                  margin = {top: 40, bottom: 44, left: 40, right: 22};

              histogram.drawChart('#container',
                {
                  title: 'Non-bridge authors',
                  height: height,
                  width: width,
                  margin: margin
                });
              $('#container svg').css({
                'position': 'absolute',
                'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
                'margin-bottom': 15 + 'px'});
          });
          }
        });
    }
  };
});
