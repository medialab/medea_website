'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:zeppelin
 * @description The directove of directives
 * # zeppelin
 */
angular.module('driveoutApp.directives.zeppelin', [])
  .filter('unsafe', function($sce) { return $sce.trustAsHtml; })
  .directive('zeppelin', function() {
    return {
      templateUrl: 'views/templates/zeppelin.html',
      scope:{
        sections: '=',
        index: '='
      },
      replace: true,
      link: function postLink(scope, element, attrs) {
        console.log('scopezep', scope);

        element.on('click', '[data-click]', function(e) {
          scope.$broadcast('focus', '' + $(this).attr('data-click'));
        })

        scope.getCurrentIndex = function() {
          return scope.index;
        };
        // scope.getScrollFlag = function() {
        //   return scope.automatedScroll;
        // }

        // scope.bringTextTo = function(index) {
        //   scope.automatedScroll = true;
        //   var element = $element,
        //       sliderComponent = element.find('.slider');
        //   if (element.find('#chapter_' + index)[0] !== undefined) {
        //     sliderComponent.scrollTop(
        //       element.find('#chapter_' + index)[0].offsetTop -
        //       sliderComponent[0].offsetTop)
        //   }
        // }

        scope.next = function(fromScroll) {
          var _index = scope.index + 1;
          scope.index = Math.min(_index, scope.sections.length -1);
          if (!fromScroll)
            scope.bringTextTo(scope.index);
        };

        // goto previous slide
        scope.previous = function(fromScroll) {
          var _index = scope.index - 1;
          scope.index = Math.max(_index, 0);
          if (!fromScroll)
            scope.bringTextTo(scope.index);
        };

        // scope.steer = function(index) {
        //   console.log('scopi', this)
        //   var sections = this.sections;
        //   if (index >= 0 && index < sections.length) {
        //     if(sections[scope.index]){
        //       scope.section = sections[scope.index];
        //     }
        //   }
        // };

        //Scroll spy for the narratives' text
        $('.slider').on('scroll', function(e){
          // //Checks if the scroll has been triggered by the user or automatically
          // if (scope.$parent.getScrollFlag()) {
          //   scope.$parent.automatedScroll = false;
          //   return true;
          // }

          //Remembers the scroll position
          if (this.data === undefined)
            this.data = {oldPosition: 0, newPosition: e.currentTarget.scrollTop}
          else {
            this.data.oldPosition = this.data.newPosition;
            this.data.newPosition = e.currentTarget.scrollTop;
          }

          //Determine the next index to match
          //(could be the one before or the one after)
          var currentIndex = scope.getCurrentIndex(),
              nextIndex = this.data.newPosition < this.data.oldPosition ?
                          currentIndex - 1:
                          currentIndex + 1,
              functionToCall;

          if (nextIndex > currentIndex)
            functionToCall = scope.next
          else
            functionToCall = scope.previous

          if (element.find('#chapter_' + nextIndex)[0] !== undefined) {
            var switchViz = false,
                upDiff = 200,
                downDiff = 400;
            if (nextIndex > currentIndex) {
              functionToCall = scope.next;
              console.log(element.find('#chapter_' +
                                nextIndex)[0].offsetTop, this.scrollTop)
              switchViz = element.find('#chapter_' + nextIndex)[0].offsetTop <
                          this.scrollTop + downDiff;
            }
            else {
              functionToCall = scope.previous;
              console.log(element.find('#chapter_' +
                              currentIndex)[0].offsetTop, this.scrollTop)
              switchViz = element.find('#chapter_' + currentIndex)[0].offsetTop >
                          this.scrollTop + upDiff;
            }

            if(switchViz) {
              console.log('switchViz')
              functionToCall(true);
              scope.$apply();
            }
          }
        })

        /**
         * Note Handler
         */

        element.on('click', '[noteIndex]', function(e) {
          e.preventDefault();
          var noteNumber = + $(this).attr('noteIndex');
          console.log(noteNumber, scope.sections[scope.$parent.index].notes[noteNumber-1]);
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
