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

        //Scroll spy for the narratives' text
        $('.slider').on('scroll', function(e){
          //Remembers the scroll position
          if (this.data === undefined)
            this.data = {oldPosition: 0, newPosition: e.currentTarget.scrollTop}
          else {
            this.data.oldPosition = this.data.newPosition;
            this.data.newPosition = e.currentTarget.scrollTop;
          }

          //Determine the next index to match
          //(could be the one before or the one after)
          var currentIndex = scope.$parent.getCurrentIndex(),
              nextIndex = this.data.newPosition < this.data.oldPosition ?
                          currentIndex - 1:
                          currentIndex + 1,
              functionToCall;

          if (nextIndex > currentIndex)
            functionToCall = scope.$parent.next
          else
            functionToCall = scope.$parent.previous

          if (element.find('#chapter_' + nextIndex)[0] !== undefined) {
            var diff;
            if (nextIndex > currentIndex) {
              functionToCall = scope.$parent.next;
              diff = Math.abs(element.find('#chapter_' +
                                nextIndex)[0].offsetTop - this.scrollTop);
            }
            else {
              functionToCall = scope.$parent.previous;
              diff = Math.abs(element.find('#chapter_' +
                              currentIndex)[0].offsetTop - this.scrollTop);
            }

            if(diff < 200 ) {
              functionToCall(true);
              scope.$parent.$apply();
            }
          }
        })




        scope.$parent.$watch('height', function(h) {
           element.css({
            height: h
          })
        });

      }
    };
  })
  ;
