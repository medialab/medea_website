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
          var imageHeight = $('.vizLegendZone').find('img').height();
          var width = elementwidth,
              height = $('.vizLegendZone').position().top - (imageHeight === 0 ? 46 : 30),
              margin = {top: 40, bottom: 15, left: 27, right: 17};

          bricks.drawViz('#bricksSvgContainer',
            {
              height: height,
              width: width,
              vizName: 'viviz',
              margin: margin
            });
          $('#bricksSvgContainer svg').css({
            'position': 'absolute',
            'bottom': (element.height()- $('.vizLegendZone').position().top +
                       (imageHeight === 0 ? 5: -5))+ 'px',
            'margin-bottom': 15 + 'px'});
          window.addEventListener('resize', function() {
            if (element.height() !== 0){
              var imageHeight = $('.vizLegendZone').find('img').height();

              var elementwidth = element.width();
              var width = elementwidth,
                height = $('.vizLegendZone').position().top - (imageHeight === 0 ? 46 : 30),
                margin = {top: 40, bottom: 15, left: 27, right: 17};

              bricks.drawViz('#bricksSvgContainer',
                {
                  height: height,
                  width: width,
                  vizName: 'viviz',
                  margin: margin
                });
              $('#bricksSvgContainer svg').css({
                'position': 'absolute',
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
