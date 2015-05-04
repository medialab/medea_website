'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:zeppelin
 * @description The directove of directives
 * # zeppelin
 */
angular.module('driveoutApp')
  .filter('unsafe', function($sce) { return $sce.trustAsHtml; })
  .directive('zeppelin', function() {
    return {
      templateUrl: 'views/templates/zeppelin.html',
      scope:{
        sections: '='
      },
      link: function postLink(scope, element, attrs) {
        element.on('click', '[data-click]', function(e) {
          scope.$broadcast('focus', '' + $(this).attr('data-click'));
        })

        // goto next slide
        scope.$parent.$watch('index', function(index) {
          element.find('.slider').css({
            top: -index * scope.$parent.height
          });
        });

        scope.$parent.$watch('height', function(h) {
           element.css({
            height: h
          })
        });



      }
    };
  })
  ;
