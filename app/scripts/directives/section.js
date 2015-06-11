'use strict'

angular.module('driveoutApp.directives.section', [])
  .directive('sectiontoinsert', function ($compile) {
    return {
      replace: true,
      link: function(scope, element, attrs) {
        scope.$watch(attrs.sectionhtml, function(html) {
          console.log(attrs);
          element.html(html);
          $compile(element.contents())(scope);
        });
      }
    };
  });
