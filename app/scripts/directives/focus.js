'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:focus
 * @description
 * # focus
 */
angular.module('driveoutApp')
  .directive('focus', function ($log, HTMLFactory) {
    return {
      scope: {
        src: '='
      },
      template: '<div></div>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        $log.debug('this is the focus directive', scope.src);
        HTMLFactory.get({path:scope.src}).then(function(res){
          element.html(res.data.replace(/^.*<svg/, '<svg'));
        });

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
