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
        var elementwidth = element.width() * 9.8/10;
        var bricks = new Bricks();
        bricks.load('contents/data/bricks-partByChapters/participations.json', function() {
          var width = elementwidth,
              height = window.innerHeight/1.5,
              margin = {top: 40, bottom: 70, left: 40, right: 40};

          bricks.drawViz('#bricksSvgContainer',
            {
              height: height,
              width: width,
              vizName: 'viviz',
              margin: margin
            });
      });
    }
  };
});
