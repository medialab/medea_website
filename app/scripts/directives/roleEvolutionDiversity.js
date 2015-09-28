'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.roleevolutiondiversity', [])
  .directive('roleevolutiondiversity', function ($timeout) {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {


        var lineChart = new LineChartRoleOnly();
        lineChart.load('contents/data/roleEvolutionDiversity/participations.json', function() {
          $timeout(function() {
            var imageHeight = $('.vizLegendZone').find('img').height();
            var elementWidth = element.width(),
                elementHeight = element.height();
            var width = elementWidth,
                height = elementHeight/1.2,
                margin = {
                  top: 5,
                  bottom: 20,
                  left: 50,
                  right: 32
                };
            lineChart.drawChart('#container', {
              height: height,
              width: width,
              margin: margin
            });
            $('#container svg').css({
              'position': 'absolute',
              'left': 0 +'px',
              'bottom': (element.height()- $('.vizLegendZone').position().top +
                         (imageHeight === 0 ? 5: -5))+ 'px',
              'margin-bottom': 15 + 'px'});
          })

          window.addEventListener('resize', function() {
            if (element.width() !== 0) {
              var imageHeight = $('.vizLegendZone').find('img').height();
              var elementWidth = element.width(),
              elementHeight = element.height();
              var width = elementWidth,
                  height = elementHeight/1.2;

              lineChart.drawChart('#container',
                {
                  height: height,
                  width: width,
                  margin: margin
                });
              $('#container svg').css({
                'position': 'absolute',
                'left': 0 +'px',
                'bottom': (element.height()- $('.vizLegendZone').position().top +
                       (imageHeight === 0 ? 5: -5))+ 'px',
                'margin-bottom': 15 + 'px'
              });
            }
          });
        });
    }
  };
});
