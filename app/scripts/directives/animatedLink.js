'use strict';

angular.module('driveoutApp.directives.animatedlink', [])
  .directive('animatedlink', function () {
    return {
      link: function postLink(scope, element, attrs) {
        element.on('mouseenter', function() {
          element.find('.frontSL').removeClass('hidden')
        });
        element.on('mouseleave', function() {
          element.find('.frontSL').addClass('hidden')
        });
      }
    };
  });
