'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:focus
 * @description
 * # focus
 */
angular.module('driveoutApp')
  .directive('focus', function (HTMLFactory) {
    return {
      scope: {
        src: '='
      },
      template: '<div></div>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        HTMLFactory.get({path:scope.src}).then(function(res){
          element.html(res.data.replace(/^.*<svg/, '<svg'));
        });

        scope.$on('focus', function(e, ids) {
          var groups = ids.split(',');

          if(groups.length < 2) {

          } else {

          }
        });
      }
    };
  });
