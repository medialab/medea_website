'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.diversityacrossroles', [])
  .directive('diversityacrossroles', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementWidth = element.width(),
            elementHeight = element.height();
        var lineChart = new LineChart();
        lineChart.load('contents/data/diversityAcrossRoles/total_participations_by_ar_wmo_region_CA.csv', function() {
          var width = elementWidth/1.2,
              height = elementHeight/2.2,
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
            var elementWidth = element.width(),
                elementHeight = element.height();
            var width = elementWidth/1.2,
                height = elementHeight/2.2;
            lineChart.drawChart('#visualisation1',
              {
                height: height,
                width: width,
                margin: margin
              });
          });
        });

        lineChart.load('contents/data/diversityAcrossRoles/total_participations_by_ar_wmo_region_withoutCA.csv', function() {
          var width = elementWidth/1.2,
              height = elementHeight/2.2,
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
            var elementWidth = element.width(),
                elementHeight = element.height();
            var width = elementWidth/1.2,
                height = elementHeight/2.2;
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
