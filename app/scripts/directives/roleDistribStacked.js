'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp')
  .directive('roledistribstacked', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementWidth = element.width(),
            elementHeight = element.height();
      var stackedBars = new StackedBars();
      stackedBars.load('contents/data/roleDistribStacked/participations.json', function() {
        var width = elementWidth/2,
            height = elementHeight,
            margin = {top: 40, bottom: 70, left: elementWidth/10, right: 70};

        stackedBars.drawViz('#svgContainer',
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
