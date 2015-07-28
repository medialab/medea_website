'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:donut
 * @description
 * # donut
 */
angular.module('driveoutApp.directives.image', [])
  .directive('image', function () {
    return {
      scope: {
        ratiovertionhori: '='
      },
      link: function postLink(scope, element, attrs) {
        applyGoodSize();

        // element.find('img').css({
        //   'max-height': $('.vizLegendZone').position().top - 30 + 'px'
        // });
        window.addEventListener('resize', function() {
          if (element.width() > 0) {
            applyGoodSize();
          }
        });

        function applyGoodSize() {
          if (element.width()*0.8*scope.ratiovertionhori <$('.vizLegendZone').position().top - 30){
            element.find('img').css({
              'margin-left': (element.width() - element.width()*0.8) /2 + 'px',
              'height': '',
              'width': ''
            });
          }
          else if (element.find('img').height() === $('.vizLegendZone').position().top - 30){
            element.find('img').css({
              'margin-left': (element.width() - element.find('img').width()) /2 + 'px',
            });
          }
          else {
            element.find('img').css({
              'height': ($('.vizLegendZone').position().top - 30) + 'px',
              'width': ($('.vizLegendZone').position().top - 30) / scope.ratiovertionhori + 'px',
              'margin-left': (element.width() - ($('.vizLegendZone').position().top - 30) / scope.ratiovertionhori) /2 + 'px'
            });
          }
        }
      }
    };
  });
