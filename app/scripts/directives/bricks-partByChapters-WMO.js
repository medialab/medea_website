'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationByChapters
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.brickswmo', [])
  .directive('participationbychapterswmo', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementwidth = element.width() * 9.8/10;
        var bricks = new BricksWMO();
        bricks.load('contents/data/bricks-partByChapters-WMO/participations.json', function() {
          var width = elementwidth,
              height = element.height(),
              margin = {top: 40, bottom: 15, left: 40, right: 40};

          bricks.drawViz('#bricksSvgContainer',
            {
              height: height,
              width: width,
              vizName: 'viviz',
              margin: margin
            });
          $('#bricksSvgContainer svg').css({
            'position': 'absolute',
            'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
            'margin-bottom': 30 + 'px'});
          window.addEventListener('resize', function() {
            if (element.height() !== 0){
              var elementwidth = element.width() * 9.8/10;
              var width = elementwidth,
                height = element.height()/1.1,
                margin = {top: 40, bottom: 15, left: 40, right: 40};

              bricks.drawViz('#bricksSvgContainer',
                {
                  height: height,
                  width: width,
                  vizName: 'viviz',
                  margin: margin
                });
              $('#bricksSvgContainer svg').css({
                'position': 'absolute',
                'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
                'margin-bottom': 30 + 'px'
              });
            }
          });
      });
    }
  };
});
