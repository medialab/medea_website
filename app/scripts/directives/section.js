'use strict'

angular.module('driveoutApp.directives.section', [])
  .directive('sectiontoinsert', function ($compile) {
    return {
      replace: true,
      link: function(scope, element, attrs) {
        // console.log(attrs);
        scope.$watch(attrs.sectionhtml, function(html) {
          // console.log(attrs);
          html = html.replace('&lt;','<').replace('&gt;', '>');
          element.html(html);
          $compile(element.contents())(scope);
        });
      }
    };
  });
