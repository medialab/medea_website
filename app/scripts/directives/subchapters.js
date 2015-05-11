'use strict'

angular.module('driveoutApp')
  .directive('subchapters', function () {
    return {
      templateUrl: 'views/templates/subchapters.html',
      controller: 'SubchapterCtrl',
      link: function postLink(scope, element, attrs) {
        console.log($('.slider'))
        function scrollText(index) {
          var sliderComponent = element.$parent.find('.slider');
          if (element.find('#chapter_' + index)[0] !== undefined) {
            sliderComponent.scrollTop(
              element.find('#chapter_' + index)[0].offsetTop -
              sliderComponent[0].offsetTop)
          }
        }
      }
    };
  });
