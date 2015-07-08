'use strict'

angular.module('driveoutApp.directives.subchapters', [])
  .directive('subchapters', function () {
    return {
      templateUrl: 'views/templates/subchapters.html',
      controller: 'SubchapterCtrl',
      link: function postLink(scope, element, attrs) {
        console.log('scope', scope)
        scope.elementClicked =  function(element, value) {
          switch (element) {
            case 'radio':
              scope.bringTextTo(value);
              break;
            case 'next':
              scope.next(false);
              break;
            case 'previous':
              scope.previous(false);
              break;
          }
        }
      }
    };
  });
