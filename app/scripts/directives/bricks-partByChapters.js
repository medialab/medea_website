'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationByChapters
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.bricks', [])
  .directive('participationbychapters', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementwidth = element.width();
        var bricks = new Bricks();
        bricks.load('contents/data/bricks-partByChapters/participations.json', function() {
          var width = elementwidth,
              height = $('.vizLegendZone').position().top - 30,
              margin = {top: 40, bottom: 15, left: 10, right: -10};

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
                height = $('.vizLegendZone').position().top - 30,
                margin = {top: 40, bottom: 15, left: 10, right: -10};

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
