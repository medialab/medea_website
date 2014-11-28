'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:enbgraph
 * @description
 * # enbgraph
 */
angular.module('driveoutApp')
  .directive('enbgraph', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the enbgraph directive');
      }
    };
  });
