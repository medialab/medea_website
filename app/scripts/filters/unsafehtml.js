'use strict';

/**
 * @ngdoc filter
 * @name driveoutApp.filter:unsafeHtml
 * @function
 * @description
 * # unsafeHtml
 * Filter in the driveoutApp.
 */
angular.module('driveoutApp.filters', [])
  .filter('unsafeHtml', function ($sce) {
    return function (input) {
      return $sce.trustAsHtml(input);
    };
  });
