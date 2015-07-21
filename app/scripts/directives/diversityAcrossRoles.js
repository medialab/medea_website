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
        lineChart.load('contents/data/diversityAcrossRoles/', function() {
          var width = elementWidth/1.2,
              height = elementHeight/2.4,
              marginTopViz = {
                top: 20,
                bottom: 25,
                left: 50,
                right: 20
              },
              marginBottomViz = {
                top: 25,
                bottom: 20,
                left: 50,
                right: 20
              };
          lineChart.drawChart('#visualisation1', {
            title: 'Participations as Contributing Authors (CA)',
            height: height,
            width: width,
            margin: marginTopViz
          });
          lineChart.drawChart('#visualisation2', {
            title: 'Participations in Roles of Responsibility (CLA/LA/RE)',
            dataName: 'others',
            height: height,
            width: width,
            margin: marginBottomViz
          });

          $('#visualisation1 svg').css({
            'position': 'absolute',
            'left': (element.width() - $('#visualisation1 svg').width())/2 +'px',
            'margin-bottom': 30 + 'px'});
          $('#visualisation2 svg').css({
            'position': 'absolute',
            'left': (element.width() - $('#visualisation2 svg').width())/2 +'px',
            'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
            'margin-bottom': 30 + 'px'});

          window.addEventListener('resize', function() {
            if (element.height() !== 0) {
              var elementWidth = element.width(),
                  elementHeight = element.height();
              var width = elementWidth/1.2,
                  height = elementHeight/2.4;
              lineChart.drawChart('#visualisation1',
                {
                  title: 'Participations as Contributing Authors (CA)',
                  height: height,
                  width: width,
                  margin: marginTopViz
                });
              lineChart.drawChart('#visualisation2', {
                title: 'Participations in Roles of Responsibility (CLA/LA/RE)',
                dataName: 'others',
                height: height,
                width: width,
                margin: marginBottomViz
              });
              $('#visualisation1 svg').css({
                'position': 'absolute',
                'left': (element.width() - $('#visualisation1 svg').width())/2 +'px',
                'margin-bottom': 30 + 'px'});
              $('#visualisation2 svg').css({
                'position': 'absolute',
                'left': (element.width() - $('#visualisation2 svg').width())/2 +'px',
                'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
                'margin-bottom': 30 + 'px'
              });
            }
          });
        });

    }
  };
});
