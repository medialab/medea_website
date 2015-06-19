'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:donut
 * @description
 * # donut
 */
angular.module('driveoutApp.directives.donut', [])
  .directive('donut', function () {
    return {
      template: '<div></div>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        element.text('this is the donut directive');
      }
    };
  });
