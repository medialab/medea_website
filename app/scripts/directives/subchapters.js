'use strict'

angular.module('driveoutApp.directives.subchapters', [])
  .directive('subchapters', function () {
    return {
      templateUrl: 'views/templates/subchapters.html',
      controller: 'SubchapterCtrl',
      link: function postLink(scope, element, attrs) {

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
        function scrollText(index) {
          var sliderComponent = element.$parent.find('.slider');
          if (element.find('#chapter_' + index)[0] !== undefined) {
            console.log(sliderComponent.scrollTop)
            sliderComponent.scrollTop(
              element.find('#chapter_' + index)[0].offsetTop -
              sliderComponent[0].offsetTop)
          }
        }
      }
    };
  });
