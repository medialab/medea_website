'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationRatesHisto
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.lastngrepeat', [])
  .directive('lastngrepeat', function ($timeout) {
    return function(scope, element) {
      if (scope.$last) {
        $timeout(function() {
          scope.$parent.$emit('lastngrepeatdone');
        });
      }
    };
});
