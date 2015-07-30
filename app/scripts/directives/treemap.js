
/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.treemap', [])
  .directive('treemap', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementWidth = element.width(),
            elementHeight = element.height();

        var legendHeight = $('.vizLegendZone').height();
        var imageHeight = $('.vizLegendZone').find('img').height();
        var width = elementWidth,
            height = elementHeight - legendHeight - (imageHeight === 0 ? 55 : 0);

        drawTreemap(height);
        window.addEventListener('resize', function() {
          var elementWidth = element.width(),
            elementHeight = element.height();

          var legendHeight = $('.vizLegendZone').height();
          var imageHeight = $('.vizLegendZone').find('img').height();
          var width = elementWidth,
              height = elementHeight - legendHeight - (imageHeight === 0 ? 55 : 0);

          drawTreemap(height);
        })
      }
    };
  });
