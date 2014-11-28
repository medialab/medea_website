'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:focus
 * @description
 * # focus
 */
angular.module('driveoutApp')
  .directive('focus', function ($log) {
    return {
      scope: {
        src: '='
      },
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        $log.debug('this is the focus directive');

        scope.$on('focus', function(e, ids) {
          $log.info('focus on', ids);
          var groups = ids.split(',');

          if(groups.length < 2) {

          } else {

          }
        });
      }
    };
  });
