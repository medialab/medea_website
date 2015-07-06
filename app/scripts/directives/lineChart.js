'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationByChapters
 * @description
 * # linechart diagram
 */
angular.module('driveoutApp.directives.linechart', [])
  .directive('linechart', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var lineChart = new LineChart();
        lineChart.load('data/total_participations_by_ar_wmo_region_CA.csv', function() {
          var width = element.innerWidth/1.2,
              height = element.innerHeight/2.2,
              margin = {
                top: 70,
                bottom: 70,
                left: 70,
                right: 70
              };
          lineChart.drawChart('#visualisation1', {
            height: height,
            width: width,
            margin: margin
          });

          window.addEventListener('resize', function() {
            var width = element.innerWidth / 2,
                height = element.innerHeight /4;
            lineChart.drawChart('#visualisation1',
              {
                height: height,
                width: width,
                margin: margin
              });
          });
        });

        lineChart.load('data/total_participations_by_ar_wmo_region_withoutCA.csv', function() {
          var width = element.innerWidth/1.2,
              height = element.innerHeight/2.2,
              margin = {
                top: 70,
                bottom: 70,
                left: 70,
                right: 70
              };
          lineChart.drawChart('#visualisation2', {
            height: height,
            width: width,
            margin: margin
          });

          window.addEventListener('resize', function() {
            var width = element.innerWidth / 2,
                height = element.innerHeight /4;
            lineChart.drawChart('#visualisation2',
              {
                height: height,
                width: width,
                margin: margin
              });
          });
        });
    }
  };
});
